"use strict";

const JWT = require("jsonwebtoken");
const {
  AuthFailureError,
  NotFoundError,
} = require("../../core/error.response");
const { findKeyByUserId } = require("../../models/repositories/keytoken.repo");
const asyncHandler = require("../../helpers/asyncHandler");
const UserValidate = require("../../validate/user.validate");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify", err);
      } else {
        // console.log("decode verify", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const user_id = req.headers[HEADER.CLIENT_ID];
  // --------------------------------------------------
  // Validate user_id
  // --------------------------------------------------
  const userInput = {
    id: user_id,
  };

  const { error, value } =
    UserValidate.userAuthenticationSchema.validate(userInput);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  // --------------------------------------------------
  // Lấy public key, private key, refresh token
  // --------------------------------------------------
  const keyStore = await findKeyByUserId({ user_id });
  if (!keyStore) throw new NotFoundError("Error: Not found keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    // --------------------------------------------------
    // Trường hợp refresh token
    // --------------------------------------------------
    try {
      // --------------------------------------------------
      // Validate refresh token và giải mã
      // --------------------------------------------------
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      if (!refreshToken || refreshToken == "")
        throw new AuthFailureError("Error: Invalid Request");
      const decodeUser = await verifyJWT(refreshToken, keyStore.private_key);

      // --------------------------------------------------
      // Kiểm tra refresh token khớp với user_id
      // --------------------------------------------------
      if (user_id != decodeUser.id)
        throw new AuthFailureError("Error: Invalid userId");

      // --------------------------------------------------
      // Gán vào request
      // --------------------------------------------------
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (err) {
      throw err;
    }
  }

  // --------------------------------------------------
  // Trường hợp authentication
  // --------------------------------------------------
  try {
    // --------------------------------------------------
    // Validate access token và giải mã
    // --------------------------------------------------
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken || accessToken == "")
      throw new AuthFailureError("Error: Invalid Request");
    const decodeUser = await verifyJWT(accessToken, keyStore.public_key);
    // --------------------------------------------------
    // Kiểm tra refresh token khớp với user_id
    // --------------------------------------------------
    if (user_id != decodeUser.id)
      throw new AuthFailureError("Error: Invalid userId");

    // --------------------------------------------------
    // Gán vào request
    // --------------------------------------------------
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = keyStore.refresh_token;
    return next();
  } catch (err) {
    throw err;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
