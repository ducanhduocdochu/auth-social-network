"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInfoData, generateSalt } = require("../utils");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../core/error.response");
const {
  findUserByUserName,
  createUser,
  findUserByEmail,
} = require("../models/repositories/user.repo");
const {
  createOrUpdateToken,
  updateKeyToken,
  deleteKeyToken,
  addKeyTokenToTokenUseds,
  getTokenUsedsByKeyId,
} = require("../models/repositories/keytoken.repo");
const {
  createTokenPair,
} = require("../controllers/middlewares/authUtils.middleware");
const UserValidate = require("../validate/user.validate");

class AuthService {
  static register = async ({username, password, email, confirmPassword}) => {
    // --------------------------------------------------
    // Validate
    // --------------------------------------------------
    const userInput = {
      username: username,
      password: password,
      email: email,
      confirmPassword: confirmPassword,
    };

    const { error, value } = UserValidate.userRegisterSchema.validate(userInput);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // --------------------------------------------------
    // Tìm kiếm người dùng có tồn tại
    // --------------------------------------------------
    const hodderUser = await findUserByUserName({ user_name: username });
    if (hodderUser) {
      throw new BadRequestError("Error: User already registered");
    }
    const hodder = await findUserByEmail({ email: email });
    if (hodder) {
      throw new BadRequestError("Error: Email already registered");
    }

    // --------------------------------------------------
    // Mã hóa mật khẩu
    // --------------------------------------------------
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    /// --------------------------------------------------
    // Tạo người dùng
    // ---------------------------------------------------
    const newUser = await createUser({
      user_slug: username + String(Math.floor(Math.random() * (9999 -  + 1000)) + 1000),
      user_name: username,
      user_password: passwordHash,
      user_salf: salt,
      user_email: email,
      user_phone: "",
      user_gender: "none",
      user_avatar: "",
      user_date_of_birth: "1/1/1990",
      user_status: "pending",
      user_type: "default",
    });
    if (newUser) {
      return {
        metadata: {
          user: getInfoData({
            fileds: ["id", "user_name"],
            object: newUser,
          }),
        },
      };
    }
    throw new BadRequestError("Error: Create user fail");
  };

  static login = async ({ username, password }) => {
    // --------------------------------------------------
    // Validate
    // --------------------------------------------------
    const userInput = {
      username: username,
      password: password,
    };

    const { error, value } = UserValidate.userLoginSchema.validate(userInput);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // --------------------------------------------------
    // Tìm kiếm người dùng tồn tại
    // --------------------------------------------------
    const foundUser = await findUserByUserName({ user_name: username });
    if (!foundUser) throw new BadRequestError("Error: User not registered");
    // --------------------------------------------------
    // Kiểm tra mật khẩu
    // --------------------------------------------------
    const match = await bcrypt.compare(password, foundUser.user_password);
    if (!match) {
      throw new BadRequestError("Error: Authentication error");
    }

    // --------------------------------------------------
    // Tạo key và token
    // --------------------------------------------------
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const { id } = foundUser;
    const tokens = await createTokenPair(
      { id, user_name: foundUser.user_name, user_avatar: foundUser.user_avatar },
      publicKey,
      privateKey
    );

    const keyToken = await createOrUpdateToken({
      user_id: id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyToken) {
      throw new BadRequestError("Error: Authentication error");
    }
    return {
      metadata: {
        user: getInfoData({ fileds: ["id", "user_slug" ,"user_name", "user_avatar"], object: foundUser }),
        tokens,
      },
    };
  };

  static logout = async ({ user_id}, refreshToken) => {
    const key = await addKeyTokenToTokenUseds({ user_id, refreshToken });
    const delKey = await deleteKeyToken({ user_id });
    if (!key || !delKey) throw AuthFailureError("Error server")
    return {
      metadata: {
        delKey,
      },
    };
  };

  static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
    // --------------------------------------------------
    // Lấy từ user
    // --------------------------------------------------
    const { id, user_name } = user;
    // --------------------------------------------------
    // Xử lí đã đăng xuất
    // --------------------------------------------------
    const keyTokenUseds = await getTokenUsedsByKeyId({key_id: id})
    if (keyTokenUseds.includes(refreshToken)) {
      // await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError("Something wrong happen !! Please relogin");
    }
    if (keyStore.refresh_token != refreshToken) {
      throw new AuthFailureError("User not registered");
    }

    // --------------------------------------------------
    // Tìm người dùng
    // --------------------------------------------------
    const foundUser = await findUserByUserName({ user_name });
    if (!foundUser) throw new AuthFailureError("User not registered");

    // --------------------------------------------------
    // Tạo token
    // --------------------------------------------------
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { id, user_name },
      publicKey,
      privateKey
    );

    const keyToken = await createOrUpdateToken({
      user_id: id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });
    if (!keyToken) {
      throw new BadRequestError("Error: Authentication error");
    }

    const key = await addKeyTokenToTokenUseds({ user_id: id, refreshToken });
    if (!key) throw AuthFailureError("Error server")

    return {
      metadata: {
        user: { id, user_name },
        tokens,
      },
    };
  };
}

module.exports = AuthService;
