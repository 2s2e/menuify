const mongoose = require('mongoose')

const Menus = new mongoose.Schema({
    group: {type:String, required:true},
    restaurant: {type:String, required:true},
    category: {type:String},
    subcategory: {type:String},
    item: {type:String, required:true},
    image: {type:[String], required:true}
})

const model = mongoose.model('Menus', Menus, "Menus")
module.exports = model