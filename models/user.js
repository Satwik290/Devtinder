const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true , minLength:4, maxLength: 20},
  lastname: { type: String, required: true},
  email:{ type: String, lowercase: true ,required: true, unique: true , trim: true },
  password: { type: String, required: true},
  age:{type: Number},
  gender:{type:String, validate(value){
    if(!["male", "female"].includes(value)){
      throw new Error("Gender is not valid");
    }
  } },
  about:{type : String ,  default:"about not provided"},
  skill:{type:[String]}
}, {
  timestamps:true
});

module.exports = mongoose.model('User', userSchema);
