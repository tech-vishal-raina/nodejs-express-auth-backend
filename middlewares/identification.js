const jwt = require('jsonwebtoken');
exports. identifier = (req,res,next) =>{
     let token = req.headers.authorization || req.cookies['Authorization'];
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization
    }
    else{
        token = req.cookies['Authorization']
    }
    if(!token){
        return res.status(403).json({success: false, message:'Unauthorized'});
    }

    try{
       
       const userToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const jwtVerifies = jwt.verify(userToken,process.env.TOKEN_SECRET);
        if(jwtVerifies){
            req.user = jwtVerifies;
            next();
        }else{
            throw new Error('error in the token');
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }

};