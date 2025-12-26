const mongoose=require("mongoose")

const userschema=new mongoose.Schema({

    name:{
       type:String,
       required:[true,"name is required"],
       trim:true
    },
    email:{
       type:String,
       required:[true,"email is required"],
       trim:true 
    },
    password:{
       type:String,
       required:[true,"password is required"],
       


    },
    phone:{
        type:Number,

    },
    address: {
    type: String,   
    default: "",
  },
    bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ],
  
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
},{timestamps:true})


module.exports=mongoose.model("user",userschema)