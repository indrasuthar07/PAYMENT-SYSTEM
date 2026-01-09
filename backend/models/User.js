const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    trim: true
  },
  lastName:{
    type:String,
    trim:true
  },
  email:{
    type:String,
    required: true,
    unique:true,
    trim: true,
    lowercase:true
  },
  password:{
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not using Google OAuth
    }
  },
  googleId:{
    type: String,
    sparse: true,
    unique: true
  },
  dateOfBirth:{
    type:Date
  },
  mobileNo:{
    type:String,
    trim:true
  },
  balance:{
    type:Number,
    default: 0,
    min:0
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('User',userSchema); 