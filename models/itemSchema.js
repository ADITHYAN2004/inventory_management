
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/inventroy-schema')

const itemNameSchema = mongoose.Schema({
   itemType : String,
   date: {
    type: Date,
    default: Date.now 
  },
  itemName:String,
  amount:Number,
  numberOfItem:Number,
  numberOfItemUsed_tot:Number,

})

module.exports=mongoose.model('itemName' ,itemNameSchema)