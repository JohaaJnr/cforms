var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var db = require('../config/db')
var { ensureAuth, ensureGuest } = require('../middleware/auth')
var bcrypt = require('bcrypt');
const  session  = require('express-session');

/* GET home page. */
router.get('/', ensureAuth, function(req, res, next) {
    var loggedUser = jwt.verify(req.user, 'shhhh')
   
    db.query(`SELECT * FROM users WHERE id = '${loggedUser.user.sub}'`, (err,result)=>{
      if(err) throw err
      db.query(`SELECT * FROM messeges WHERE user_id = '${result[0].id}'`, (err,msg)=>{
       
        res.render('index', { user: result[0], messege: msg })
      })
      
    })
});

router.get('/logout', (req,res,next)=>{
  req.logout((err)=>{
    if(err) throw err
    
    res.redirect('/')
  })
  
})

router.get('/createkey', ensureAuth, (req,res)=>{
  var duser = jwt.verify(req.user, 'shhhh')
  var secret = 'userApiToken'
  var userID = duser.user.sub
  bcrypt.hash(secret, 5, (err,hash)=>{
    if(err) throw err
    db.query(`UPDATE users SET token ='${hash}' WHERE id = '${userID}'`, (err,result)=>{
      if(err) throw err
      res.redirect('/')
    })
  })
})

router.get('/delete/thread/:id', (req,res)=>{
  var id = req.params.id
  db.query(`DELETE FROM messeges WHERE id = '${id}'`, (err,result)=>{
    if(err) throw err
    res.redirect('/')
  })
})

module.exports = router;
