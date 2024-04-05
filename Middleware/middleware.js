import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json("The token was not available")
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.json("Token is wrong")
            next()
        })
    }
}

export default verifyUser;