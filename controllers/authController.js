const jwt = require("jsonwebtoken")
const {signupSchema, acceptFPCodeSchema} = require("../middlewares/validator")
const {signinSchema} = require("../middlewares/validator")
const User = require("../models/usersModel")
const {doHash} = require("../utils/hashing")
const {doHashValidation} = require("../utils/hashing")
const transport = require("../middlewares/sendMail")
const { hmacProcess } = require('../utils/hashing');
const {acceptCodeSchema} = require("../middlewares/validator");
const {changePasswordSchema} = require("../middlewares/validator");

exports.signup = async (req,res)=>{
    const {email,password} = req.body;
    try{
       const{error,value}  = signupSchema.validate({email,password});
       
       if(error){
        return res.status(401).json({success:false, message: error.details[0].message})
       }

       const existingUser = await User.findOne({email});
       if(existingUser){
        return res.status(401).
        json({success:false,message:"User already exists!"})
       }
       const hashedPasssword= await doHash(password,12);
       
       const newUser = new User({
        email,
        password:hashedPasssword,
       })
        
       const result = await newUser.save();
       result.password = undefined;
       res.status(201).json({
        success:true, 
        message:"Your account has been created successfully",
        result
       });
    }catch(error){
        console.log(error)
    }
};


exports.signin= async (req,res) =>{
    const {email,password} = req.body;

    try{
         
       const{error,value}  = signinSchema.validate({email,password});
       
       if(error){
        return res.status(401).  json({success:false, message: error.details[0].message})
       }

       const existingUser = await User.findOne({email}).select('+password');

       if(!existingUser){
        return res.status(401).json({success:false,message:"Please Sign Up First!"});
       }

       const result = await doHashValidation(password,existingUser.password)
        if(!result){
           return res.status(401).json({success:false, message: 'Invalid Credentials'});
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        }, process.env.TOKEN_SECRET,
        {
            expiresIn: '8h',
        }
    );
       
        res.cookie('Authorization','Bearer '+token,{expires:new Date(Date.now() + 8 * 3600000 ),
             httpOnly:process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'})
       .json({
                success: true,
                token,
                message: 'logged in successfully',
        });

    } catch(error){
        console.log(error);
         return res.status(500).json({ success: false, message: error.message });
    }

}

exports.signout = async (req,res) =>{
    res.clearCookie('Authorization').status(200).json({success:true,message:'logged out successsfully!'})
};


exports.sendVerificationCode = async(req,res) => {
    const{email} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(400).json({success:false,message:'User does not exists!'});
}
        if(existingUser.verified){
            return res.status(400).json({success:false, message: 'You are already verified!'})
        }

        const codeValue= Math.floor(Math.random()*1000000).toString();
        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject:"verification code",
            html: '<h1>' +codeValue + '<h1>'
        })

        if(info.accepted[0] === existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue,process.env.
                HMAC_VERIFICATION_CODE_SECRET)
                existingUser.verificationCode = hashedCodeValue;
                existingUser.verificationCodeValidation = Date.now();
                await existingUser.save()
                return res.status(200).json({success:true, message: 'Code sent!'});  
        }
        res.status(400).json({success: false, message: 'Code sent failed!'});
} catch(error){
    console.log(error);
        return res.status(500).json({ success: false, message: error.message });
}
    }

   exports.verifyVerificationCode = async(req,res)=>{
    const{email,providedCode}  = req.body;
    try{
         const{error,value}  = acceptCodeSchema.validate({email,providedCode});
       
       if(error){
        return res.status(401).  json({success:false, message: error.details[0].message})
       }
       
       const codeValue = providedCode.toString();
       const existingUser = await User.findOne({email}).select("+verificationCode +verificationCodeValidation");

        if(!existingUser){
           return res.status(400).json({success:false,message:'User does not exists!'});
        }
        if(existingUser.verified){
            return res.status(400).json({success: false, message:"You are already verified!"})
        }
        if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
             return res.status(400).json({success: false, message:"Something is wrong with the code!"})
        }
        if(Date.now()-existingUser.verificationCodeValidation > 5*60*1000){
            return res.status(400).json({success:false, message: 'code has been expired!'})
        }

        const hashedCodeValue= hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET)

        if(hashedCodeValue === existingUser.verificationCode){
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save()
            return res.status(200).json({success: true, message: 'code has been verified'});
        }
        return res.status(400).json({success: false, message: 'unexpected occured!'})
    }catch(error){
        console.log(error);
    }
   }

   exports.changePassword = async (req,res) => {
   
    const {oldPassword,newPassword} = req.body;
     const {userId,verified} = req.user;
    try{
        
         const{error,value}  = changePasswordSchema.validate({oldPassword,newPassword});
       
        if (!req.user) {
         return res.status(401).json({ success: false, message: "Unauthorized: No user data found" });
        }

       if(error){
        return res.status(401).  json({success:false, message: error.details[0].message})
       }
       if(!verified){
        return res.status(401).  json({success:false, message: 'You are not verified!'});
       }
       const existingUser = await User.findOne({_id:userId}).select('+password');
        if(!existingUser){
           return res.status(400).json({success:false,message:'User does not exists!'});
    } 
    const result = await doHashValidation(oldPassword,existingUser.password);
    if(!result){
        return res .status(401) .json({success: false, message:  'Invalid credentials'});
       
    }
    const hashedPassword = await doHash(newPassword,12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({success: true, message:'Password Upadated!'});
}  catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
   };


   exports.sendForgetPasswordCode = async(req,res) => {
    const{email} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(400).json({success:false,message:'User does not exists!'});
}

        const codeValue= Math.floor(Math.random()*1000000).toString();
        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject:"Forget Password code",
            html: '<h1>' +codeValue + '<h1>'
        })

        if(info.accepted[0] === existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue,process.env.
                HMAC_VERIFICATION_CODE_SECRET)
                existingUser.forgetPasswordCode = hashedCodeValue;
                existingUser.forgetPasswordCodeValidation = Date.now();
                await existingUser.save()
                return res.status(200).json({success:true, message: 'Code sent!'});  
        }
        res.status(400).json({success: false, message: 'Code sent failed!'});
} catch(error){
    console.log(error);
        return res.status(500).json({ success: false, message: error.message });
}
    }

   exports.verifyForgetPasswordCode = async(req,res)=>{
    const{email,providedCode,newPassword}  = req.body;
    try{
         const{error,value}  = acceptFPCodeSchema.validate({email,providedCode,newPassword});
       
       if(error){
        return res.status(401).  json({success:false, message: error.details[0].message})
       }
       
       const codeValue = providedCode.toString();
       const existingUser = await User.findOne({email}).select("+forgetPasswordCode +forgetPasswordCodeValidation");

        if(!existingUser){
           return res.status(400).json({success:false,message:'User does not exists!'});
        }
       
        if(!existingUser.forgetPasswordCode || !existingUser.forgetPasswordCodeValidation){
             return res.status(400).json({success: false, message:"Something is wrong with the code!"})
        }
        if(Date.now()-existingUser.forgetPasswordCodeValidation > 5*60*1000){
            return res.status(400).json({success:false, message: 'code has been expired!'})
        }

        const hashedCodeValue= hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET);

        if(hashedCodeValue === existingUser.forgetPasswordCode){
            const hashedPassword= await doHash(newPassword,12);
             existingUser.password = hashedPassword;
            existingUser.forgetPasswordCode = undefined;
            existingUser.forgetPasswordCodeValidation = undefined;
            await existingUser.save()
            return res.status(200).json({success: true, message: 'code has been verified'});
        }
        return res.status(400).json({success: false, message: 'unexpected occured!'})
    }catch(error){
        console.log(error);
    }
   }






