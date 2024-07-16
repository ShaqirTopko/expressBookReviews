const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log("Auth middleware triggered");
    const token = req.headers['authorization'];
    if (!token) {
        console.log("No token found in session");
        return res.status(401).send("Access Denied");
    }

    try {
        const verified = jwt.verify(token.split(' ')[1], 'secretkey');
        req.user = verified;
        next();
    } catch (err) {
        console.log("Invalid token");
        res.status(400).send("Invalid Token");
    }
});


const PORT = 5005;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running!"));
