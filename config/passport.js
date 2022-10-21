var passport = require('passport')
var jwt = require('jsonwebtoken')
var GoogleStrategy = require('passport-google-oauth20').Strategy
var db = require('./db')
module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/login/auth/google"
      },
      function(accessToken, refreshToken, profile, cb) {
        var signUser = jwt.sign({ user: profile._json}, 'shhhh', { expiresIn: 60*60 })
        
        db.query(`SELECT * FROM users WHERE email = '${profile._json.email}'`, (err,result)=>{
          if(result.length == 0){
            db.query(`INSERT INTO users(id, firstName, lastName, email, photos) VALUES ('${profile._json.sub}','${profile._json.given_name}','${profile._json.family_name}','${profile._json.email}','${profile._json.picture}')`, (err,response)=>{
              if(err) throw err
              console.log('User Created')
            })
            return cb(err, signUser)
            
          }else{
            return cb(err, signUser)
          }
        })
      }

    ));
passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done){
  done(null, user)
})
}


