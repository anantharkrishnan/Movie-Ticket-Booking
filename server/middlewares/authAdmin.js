const jwt = require("jsonwebtoken")

const authAdmin=(req,res,next)=>{
    try {
        const {token}=req.cookies       
         if(!token){
           return res.status(401).json({error:"unauthorized user"})

        }
         const decodedToken= jwt.verify(token,process.env.JWT_SECRET_KEY)
         if(!decodedToken){
             return res.status(401).json({error:"unauthorized user"})
             
         }
         if(decodedToken.role!="admin"){
            return res.status(401).json({error:"unauthorized user"})
         }
          req.user=decodedToken
           next()
        
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports= authAdmin