const express = require('express')
const router = express.Router()
const { Contact } = require('../models/contact')
const { User } = require('../models/user')
const {authenticateUser} = require('../middleware/authenticate')

router.get('/', authenticateUser, (req,res)=>{
    Contact.find({user: req.user_id})
        .then((contacts)=>{
            res.send(contacts)
        })
        .catch((err)=>{
            res.send(err)
        })
})

// route - to create a contact
router.post('/', authenticateUser, (req,res)=>{
    const body = req.body
    const contact = new Contact(body)
    contact.user = req.user._id
    contact.save()
        .then((contact)=>{
            if(contact) {
                res.send(contact)
            } else {
                res.send({})
            }           
        })
        .catch((err)=>{
            res.send(err)
        })
})

// route - to get a contact by ID
router.get('/:id', authenticateUser, (req, res)=>{
    const id = req.params.contactID
    Contact.findById({user:req.user._id, _id:id})
        .then((contact)=>{
            if(contact) {
                res.send(contact)
            } else {
                res.send({})
            }          
        })
        .catch((err)=>{
            res.send(err)
        })
})

// route - to delete a record by id
router.delete('/:id', authenticateUser, (req, res)=>{
    const id = req.params.id
    Contact.findByIdAndDelete({user:req.user._id,_id:id})
        .then((contact)=>{
            if(contact) {
                res.send(contact)
            } else {
                res.send({})
            }
        })
        .catch((err)=>{
            res.send(err)
        })
})

module.exports = { contactRouter: router }