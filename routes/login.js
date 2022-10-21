var express = require('express')
var passport = require('passport')
const { ensureGuest } = require('../middleware/auth')
var Router = express.Router()

Router.get('/', ensureGuest, (req,res)=>{
   res.render('login')
})

Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}) )

Router.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login'}), (req,res)=>{
   res.redirect('/')
})

module.exports = Router