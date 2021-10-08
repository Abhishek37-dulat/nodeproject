// import { compare, genSalt, hash, bcrypt } from "bcryptjs";
const bcrypt = require("bcrypt");
import { sign } from "jsonwebtoken";
import User from "../models/userModel";
import constants from "../constants.json";
import { getAllItems, randomNumGen, editItem } from "../utils";

import UserVerification from "../models/UserVerification";

import PasswordReset from "../models/PasswordReset";

//email handler
import * as nodemailer from 'nodemailer';

//unique string 
import { v4 as uuidv4 } from 'uuid';

import { config } from "dotenv";
config();

import path from "path";

//nodemailer stuff
let transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  }
})

//testing success
transporter.verify((error, success) => {
  if(error) {
    console.log(error);
  }
  else{
    console.log("Ready for messages");
    console.log(success);
  }
})


export const registerUser = async (req, res) => {
    
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name)
      return res
        .status(400)
        .json({ error: constants.error.enterAllNeccessarry });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ error: constants.authError.userAlreadyExists });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);


    const newUser = new User({
      email,
      password: passwordHash,
      name,
      verified: false,
    });
    const savedUser = await newUser.save().then((result)=>{
      //handle account verification
      sendVerificationEmail(result, res);
    }).catch((error) => {
      console.log(error);
    })
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ error: constants.error.unexpected, info: err.message });
  }
};

//send verification email
const sendVerificationEmail = ({_id, email}, res) => {
  //url to be used in the email
  const currentUrl = "http://localhost:5000/";

  const uniqueString = uuidv4()+_id;

  //mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Verify your email address to complete the signup and login into your account.</p>
    <p>This link <b>expres in 6 hours.</b></p>
    <p>Press <a href=${currentUrl+"user/verify/"+_id+"/"+uniqueString}>here</a> to proceed.</p>`,
  };

  //hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now()+21600000,
      });
      newVerification
           .save()
           .then(()=>{
             transporter
                .sendMail(mailOptions)
                .then(()=>{
                  //email sent and verification record saved
                  res.json({
                    status: "PENDING",
                    message: "Verification email sent successfully",
                  })
                })
                .catch((error) => {
                  console.log(error);
                  res.json({
                    status: "FAILED",
                    message: "verification email failed",
                  })
                })
           })
           .catch((error) => {
             console.log(error);
             res.json({
              status: "FAILED",
              message: "couldn't save verification email data!",
            })
      })
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occurred while hashing email data!",
      })
    })   
}

//verify email 
export const verifyEmail = async (req, res) => {
  let {userId, uniqueString} = req.params;

  UserVerification
      .find({userId})
      .then((result) => {
        if(result.length > 0) {
          //user verification record exists so we proceed
          const {expiresAt} = result[0];
          const hashedUniqueString = result[0].uniqueString;

          //checking for expired unique string
          if(expiresAt < Date.now()) {
            //record has expired so we delete it
            UserVerification
               .deleteOne({userId})
               .then(result => {
                 User
                    .deleteOne({_id: userId})
                    .then(()=>{
                      let message = "Link has expired. Please signup again.";
                      res.redirect(`/user/verified/error=true&${message}`);
                    })
                    .catch(error => {
                      console.log(error);
                      let message = "Clearing user with expired unique string failed";
                      res.redirect(`/user/verified/error=true&${message}`);
                    })
               })
               .catch((error) => {
                 console.log(error);
                 let message = "An error occurred while clearing expired user verification record";
                 res.redirect(`/user/verified/error=true&${message}`);
               })   
          }
          else{
            //valid record exists os we validate the user string
            //First compare the hashed unique string

            bcrypt
              .compare(uniqueString, hashedUniqueString)
              .then(result => {
                if(result){
                  //string match
                  User
                    .updateOne({_id: userId}, {verified: true})
                    .then(()=> {
                      UserVerification
                        .deleteOne({userId})
                        .then(()=>{
                          res.sendFile(path.join(__dirname,"../view/verified.html"));
                        })
                        .catch(error => {
                          console.log(error);
                          let message = "An error occurred while finalizing the successfully verfication.";
                          res.redirect(`/user/verified/error=true&${message}`);
                        })
                    })
                    .catch(error=>{
                      console.log(error);
                      let message = "An error occurred while verifying user records to show verified.";
                      res.redirect(`/user/verified/error=true&${message}`);
                    })
                }
                else{
                  let message = "Invalid verfication details passed. check your inbox.";
                  res.redirect(`/user/verified/error=true&${message}`);
                }
              })
              .catch((error) => {
                console.log(error);
                let message = "An error occurred while comparing unique String";
                res.redirect(`/user/verified/error=true&${message}`);
              })
          }
        }
        else{
          //user verification record dosen't exists
          let message = "Account verification record dosen't' exists or verified successfully!. please sign up or login";
          res.redirect(`/user/verified/error=true&${message}`);
        }
      })
      .catch((error) => {
        console.log(error);
        let message = "An error occurred while verifying user records";
        res.redirect(`/user/verified/error=true&${message}`);
      })
}


//verified page route
export const verifyPageRoute = async (req, res) => {
  res.sendFile(path.join(__dirname,"../view/verified.html"))
}












export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: constants.error.noNeccessarry });

    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(404).json({ error: constants.authError.noUser });
    if(!user.verified){
      res.json({ 
        status:"FAILED",
        message:"Email hasn't been verified yet. check your inbox."
    })
    } else{
      const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ error: constants.authError.invalidCredentials });

    res.status(200).json({
      info: constants.userAuth.loginSuccess,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
    }  
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




// "/requestPasswordReset"
// Password reset stuff
 
export const PasswordResetStuff = (req, res) => {
  const { email, redirectUrl } = req.body;

  // check if email exists.
  User.find({ email })
    .then((data) => {
      if (data.length) {
        // User exists

        // check if user is verified

        if (!data[0].verified) {
          res.json({
            status: "FAILED",
            message: "Email hasn't been verified yet. Check your inbox.",
          });
        } else {
          // email is proceed with reset request
          // prepare password reset token

          sendResetEmail(data[0], redirectUrl, res);
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No account with the supplied email exists!",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "FAILED",
        message: "An error occurred while checking for existing user",
      });
      console.log(err);
    });
};

// send password reset email
const sendResetEmail = ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;

  // First, we clear all existing reset records
  PasswordReset.deleteMany({ userId: _id })
    .then((result) => {
      // Reset records deleted successfully
      // Now we send the email

      // mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<p>We heard that you lost your password.</p> <p> Don't worry, use the link below to reset it.</p> <p> This link <b>expires in 60 minutes</b>. </p> <p>Press <a href=${
          redirectUrl + "/" + _id + "/" + resetString
        }>here</a> to proceed.</p>`,
      };

      // hash the resetString
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          // set values in password reset collection
          const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  // reset email sent and password reset record saved.
                  res.json({
                    status: "PENDING",
                    message: "Password reset email sent",
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "Password reset email failed",
                  });
                  console.log(err);
                });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Couldn't save password reset data",
              });
            });
        })
        .catch(() => {
          res.json({
            status: "FAILED",
            message: "An error occurred while hashing password reset data!",
          });
        });
    })
    .catch((error) => {
      // Error while clearing existing records
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Clearing existing password reset records failed.",
      });
    });
};

// "/resetPassword"
// Actually reset password
 
export const ActuallyResetPassword = (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // password reset record exists so we proceed

        const { expiresAt } = result[0];
        const hashedResetString = result[0].resetString;

        // checking for expired reset string
        if (expiresAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then((result) => {
              // Reset record deleted successfully
              res.json({
                status: "FAILED",
                message: "Password reset link has expired.",
              });
            })
            .catch((error) => {
              // deletion failed
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Clearing password reset record failed.",
              });
            });
        } else {
          // valid reset record exists so we validate the reset string
          // First compare the hashed reset string

          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                // Strings match
                // Hash password again

                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    // update user password record

                    User.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        // Update complete. Now delete reset record
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            // both user record and reset record updated
                            res.json({
                              status: "SUCCESS",
                              message: "Password has been reset successfully.",
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            res.json({
                              status: "FAILED",
                              message:
                                "An error occurred while finalizing password reset.",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.json({
                          status: "FAILED",
                          message: "Updating user password failed.",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    res.json({
                      status: "FAILED",
                      message: "An error occurred while hashing new password.",
                    });
                  });
              } else {
                // Existing record but incorrect reset string passed.

                res.json({
                  status: "FAILED",
                  message: "Invalid password reset details passed.",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Comparing password reset strings failed",
              });
            });
        }
      } else {
        // Password reset record doesn't exist
        res.json({
          status: "FAILED",
          message: "Password reset request not found.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Checking for existing password reset record failed.",
      });
    });
};




























// export const userProfile = async (req, res) => {
//   try{
//     const { email, password, name } = req.body;
//   }catch (err) {}
// };

// export const editProduct = async (req, res) => {
//   const index = req.params._id;
//   const { updateItem } = req.body;
//   await editItem(productModel, index, updateItem, res);
// };
  




// export const getAllUsers = async (_req, res) => {
//   await getAllItems(User, res);
// };
