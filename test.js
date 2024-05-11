const crypto = require("crypto");
const currentTimestamp = Math.floor(Date.now());
console.log("Current timestamp:", currentTimestamp);

const string = "abcd" + currentTimestamp + "ducanh";
console.log(string);

const hmac = crypto.createHmac("sha256", "ducanh");
hmac.update(string);
const hmacResult = hmac.digest("hex");

console.log(hmacResult);
