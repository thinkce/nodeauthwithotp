const User = require("../models/users.models");
const bcrypt = require("bcryptjs");
const auth = require('../middlewares/auth');
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secrete-key";
const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "81c1ebeb",
    apiSecret: "pTTQf8eyGGZDNVDh"
});

async function login({ email, password }, callback ) {
    const user = await User.findOne({ email });

    if (user != null){
        if(bcrypt.compareSync(password, user.password)){
            const token = auth.generateAccessToken(email);
            return callback(null, { ...user.toJSON(), token});
        }
        else{
            return callback({ message: "Invalid Password"});
        }
    }
    else{
        return callback({ message: "Invalid email"});
    }
}
async function register(params, callback){
    if(params.email === undefined){
        return callback({message: "Username is required"});
    }
    if(params.password === undefined){
        return callback({message: "Password is required"});
    }
    const user = new User(params);
    user.save()
        .then((response) =>{
            return callback(null, response);
        })
        .catch((error) => {
           return callback(error);
        });
}

async function createOtp(params, callback){
    const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${params.phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    console.log(`Your verification code is ${otp} . This expires next 5minutes`);

    const fro = "Vonage APIs";
    const to = params.phone;
    const text = `Your verification code is ${otp} . This expires next 5minutes`;

    vonage.message.sendSms(fro, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    });
    return callback(null, fullHash);

}

async function verifyCode(params, callback){
    let [hashValue, expires] = params.hash.split('.');
    let now = Date.now();
    if(now > parseInt(expires)) return callback("Verification Code Expired");
    let data = `${params.phone}.${params.otp}.${expires}`;
    let newCalculateHash = crypto.createHmac("sha256", key).update(data).digest("hex");
    if(newCalculateHash === hashValue){
        return callback(null, "Success");
    }
    return callback("Invalid verification code");
}

module.exports = {
    login,
    register,
    createOtp,
    verifyCode,
};
