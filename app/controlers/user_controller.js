const express = require('express')
const router = express.Router()
const {authenticateUser} = require('../middleware/authenticate')

const { User } = require('../models/user')

router.get('/', (req,res)=>{
    User.find()
        .then((users)=>{
            if(users) {
                res.send(users)
            } else {
                res.send({})
            }
        })
        .catch((err)=>console.log(err))
})

// localhost:3000/user/register
router.post('/register', (req, res)=>{
    const body = req.body
    const user = new User(body)
    user.save()
        .then((user)=>{
            res.send({user, notice: 'successfully registered'})
        })
        .catch(err=>res.send(err))
})

// localhost:3000/user/login
router.post('/login', (req,res)=>{
    
    const body = req.body
    // static method is called on model/class
    User.findByEmailAndPassword(body.password, body.email)
        .then((user)=>{
            return user.generateToken()
        })
        .then((token)=>{
            // res.send(token)
            res.send('successfully logged in')
            res.header('x-auth', token).send()           
        })
        .catch(err=>res.send(err))
})

router.delete('/logout', authenticateUser, (req, res) =>{
    // console.log(req.token)
    if(req.user) {
        req.user.tokens = req.user.tokens.filter(token=>token.token!=req.token)
        req.user.save()
        .then((user)=>{
            res.send({user, notice: "successfully logged out"})
        })
        .catch(err=>res.send(err))
    } else {
        res.send('user logged out')
    }   
})

router.delete('/logout-from-all', authenticateUser, (req, res) =>{
    if(req.user) {
        // req.user.tokens = []
        User.update({_id: req.user._id}, {$set: {tokens:[]}})
            .then((user)=>{
                res.send({user, notice: "successfully logged out"})
            })
            .catch(err=>res.send(err))
        // req.user.save()
        //     .then((user)=>{
        //         res.send({user, notice: "successfully logged out"})
        //     })
        //     .catch(err=>res.send(err))
    } else {
        res.send('user not logged in')
    }
})

module.exports = {
    usersRouter: router
}