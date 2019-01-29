const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }   
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
})

userSchema.pre('save', function(next) {
    if(this.isNew) {
        bcrypt.genSalt(10).then((salt)=>{
            bcrypt.hash(this.password, salt).then((hashPassword)=>{
                this.password = hashPassword
                next()
            })
        })
    } else {
        next()
    }    
})

userSchema.statics.findByEmailAndPassword = function(password, email) {
    const User = this
    return User.findOne({email})
            .then((user)=>{
                if(user) {
                    return bcrypt.compare(password, user.password)
                            .then((result)=>{
                                if(result){
                                    // return new Promise((res,rej)=>{
                                    //     res(user)
                                    // })
                                    return Promise.resolve(user)
                                } else {
                                    // return new Promise((res,rej)=>{
                                    //     rej('invalid password')
                                    // })
                                    return Promise.reject('invalid password or email')
                                }
                            })
                } else {
                    // return new Promise((res,rej)=>{
                    //     rej('invalid email')
                    // })
                    return Promise.reject('invalid email or password')
                }
            })
            .catch((err)=>{
                // return new Promise((res,rej)=>{
                //     rej(err)
                // })
                return Promise.reject(err)
            })
}

userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        userID: user._id
    }

    const token = jwt.sign(tokenData, 'dct@welt433')
    user.tokens.push({token})

    return user.save().then((user)=>{
        return token
    })
    .catch(err=>err)
}

userSchema.statics.findByToken = function(token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'dct@welt433')
    } catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({_id:tokenData.userID, 'tokens.token': token})
            .then((user)=>{
                return Promise.resolve(user)
            })
            .catch(err=>Promise.reject(err))
}

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}