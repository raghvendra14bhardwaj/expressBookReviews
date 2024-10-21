const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify the JWT token
        jwt.verify(token, "your_secret_key", (err, user) => {
            if (err) {
                // If the token is invalid or expired, respond with a 403 error
                return res.status(403).json({ message: "Unauthorized" });
            }
            // If the token is valid, save the user information to req and proceed
            req.user = user;
            next();
        });
    } else {
        // If no token is found in the session, respond with a 403 error
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
