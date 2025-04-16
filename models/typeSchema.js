
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/inventroy-schema')

const itemTypeSchema = mongoose.Schema({
   itemType : String,
   date: {
    type: Date,
    default: Date.now 
  }

})

module.exports=mongoose.model('itemType' ,itemTypeSchema)