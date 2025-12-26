const jwt= require("jsonwebtoken")

const createToken=(id,role)=>{


try {
    const token= jwt.sign({id:id,role:role},process.env.JWT_SECRET_KEY,{expiresIn:"14d"})
     return token
    
} catch (error) {
    console.log(error);
    throw new Error("token creation failed",error);
}

}

module.exports = createToken