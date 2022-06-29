const bcryptjs = require('bcryptjs');
const userService = require("../services/users.services");

exports.register = (req, res, next) => {
    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10);
    console.log("Register Page");
    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result) => {
        if (error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result,
        });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
    console.log("Register Page");
  userService.login({ email, password }, (error, results) => {
      if (error){
          return next(error);
      }
      return res.status(200).send({
          message: "Success",
          data: results,
      });
  });
};

exports.home = (req, res, next) => {
    console.log("Login Page");
    return res.status(200).json({ message: "Authorized User!"});

};

exports.otplogin = (req, res, next) => {
    userService.createOtp(req.body, (error, results) => {
        if (error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

exports.verifyOtp = (req, res, next) => {
    userService.verifyCode(req.body, (error, results) => {
        if (error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};
