/*
to store information about a contact - like the name, email, mobile, website etc

schema -tells what feilds must be present in all documents
schema types - tells what type the fiels belongs to
schema types - string, Number, Array, Boolean, Date, Object
*/

/*
    id
    name - String
    mobile - String
    email - string
    website - string
    createdAt - Date
*/

const mongoose = require('mongoose')
const validator = require('validator')


//const Schema = mongoose.Schema
const { Schema } = mongoose
const contactSchema = new Schema({
    //all the fields, it's types, and its validatins
    contactID: {
        type: Number,
        required: false
    }, 
    name: {
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 128
    },
    mobile: {
        type: String,
        required: true,
        //custom validations
        validate: {
            validator: function(value) {
                return validator.isNumeric(value)
            },
            message: function(){
                return 'invalid mobile number format'
            }
        }
    },
    email: {
        type: String,
        validate: {
            validator: function(value){
                if(value.length==0){
                    return true
                }
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }
    },

    website: {
        type: String,
        validate: {
            validator: function(value){
                if(validator.isEmpty(value)){
                    return true
                }
                return validator.isURL(value)
            },
            message: function(){
                return 'invalid URL format'
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Contact = mongoose.model('Contact', contactSchema)

// Contact.schema.add({
    
// })

module.exports = { Contact }