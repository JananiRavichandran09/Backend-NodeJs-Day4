import User from '../Model/userSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        console.log("hashPassword", hashPassword)
        const newUser = new User ({username,email, password:hashPassword})
        await newUser.save()
        res.status(200).json({message:"Registered Successfully", data:newUser})
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}




export const dashboard = (req, res) => {
     return res.json("Success")
}


export const loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (err) {
                        res.json("the password is incorrect")
                    }
                    if (response) {
                        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        res.cookie("token", token);

                        res.json("Success")
                    } else {
                        res.json("the password is incorrect")
                    }
                
                })
            }
            else {
                res.json("No records existes")
            }
        })  
    }







export const forgotpassword = async (req, res) => {
    const {_id, email } = req.body
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
            return res.send({Status:"User not Exists"})
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            
            var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PW
  }
});

var mailOptions = {
  from: process.env.EMAIL_ID,
  to: email,
  subject: 'Reset Your Password',
  text: `http://localhost:5173/resetpassword/${user._id}/${token}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
      console.log(error);
      
  } else {
   return res.send({Status:"Success"})
  }
});

    })
}





export const  resetPassword =  (req, res) => {
    const {id, token } = req.params
    const { password } = req.body
  
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ Status: "Error with Token" })
            
        }
        else {
            
            bcrypt.hash(password, 10)
                .then(hash => {
                    User.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(u => res.send({ Status: "Success" }))
                        .catch(err => res.send({ Status: err }))
                    console.log(err);
                })
                .catch(err => res.send({ Status: err }))
            console.log(err);
        }
    })
}




// export const  resetPassword = async (req, res) => {
//     const { id, token } = req.params
//     const { password } = req.body
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.json({ Status: "Error with Token" })
            
//         }
//         else {
            
//             bcrypt.hash(password, 10)
//                 .then(hash => {
//                     User.findByIdAndUpdate({ _id: id }, { password: hash })
//                         .then(u => res.send({ Status: "Success" }))
//                         .catch(err => res.send({ Status: err }))
//                     console.log(err);
//                 })
//                 .catch(err => res.send({ Status: err }))
//             console.log(err);
//         }
//     })
// }