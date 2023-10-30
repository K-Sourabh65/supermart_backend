import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const isLoggedIn = async (req, res, next) => {
    try{
        //de-structuring token from cookies
        const { token } = req.cookies;

        // check weather user is authenticated
        if (!token) {
            return next(
                res.status(500).json({
                success: false,
                message: `User unauthenticated`,
            })
        );
    }

        // verifyint the token with the current user
        const userDetails = await jwt.verify(token, process.env.SECRET);

        // setting userDetails
        req.user = userDetails;

        next();
        }catch (error) {
            res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { isLoggedIn };
