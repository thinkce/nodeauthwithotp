const express = require('express');
const mongoose = require('mongoose');

const dbConfig = require("./config/db.config");
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const unless = require('express-unless');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => {
        console.log('Database connected');
    },
    (error) => {
        console.log("Database can't be connected: " + error);
    });

auth.authenticationToken.unless = unless;

app.use(
    auth.authenticationToken.unless({
        path: [
            { url: "/users/login", methods: ["POST", "GET"] },
            { url: "/users/register", methods: ["POST", "GET"] },
            { url: "/users/create-otp", methods: ["POST", "GET"] },
            { url: "/users/verifycode", methods: ["POST", "GET"] },
        ]
    })
);

app.use(express.json());

app.use("/users", require('./routes/users.routes'));

app.use(errors.errorHandler);

app.listen(process.env.port || 4000, function () {
   console.log("Ready to Go!");
});
