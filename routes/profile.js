const express = require("express");
const profileRouter =  express.Router();

const { userAuth } = require("../middlewares/auth");


// Profile endpoint
profileRouter.get("/profile/view", userAuth ,async (req, res) => {
  try {
   const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Profile edit
profileRouter.get("/profile/edit" , userAuth , async (req,res)=> {
    try {
        if(!validateSignUpData){
            throw new Error("Invalid edit Request ");
        }
        const loggedInUser=req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        res.json({ 
            messmessage: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });
    } catch (error) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports=profileRouter;