 const jwt = require("jsonwebtoken");

function authenticationToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    jwt.verify(token, "ThinkCE_Technologies", (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function generateAccessToken(email) {
    return jwt.sign({ data: email }, "ThinkCE_Technologies", {
        expiresIn: "1h",
    });
}

module.exports = {
  authenticationToken,
  generateAccessToken,
};