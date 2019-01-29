// DB CONFIGURATION 

const mongoose = require('mongoose')

// telling mongoose to use ES6's promise library 
mongoose.Promise = global.Promise                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

mongoose.connect('mongodb://localhost:27017/contact-manager-db', { useNewUrlParser: true})
    .then(()=> console.log('connected to DB'))
    .catch((err)=>console.log(err))

