var express = require('express')
var Router = express.Router()
var db = require('../../config/db')


Router.post('/submit', (req,res)=>{
    var usrtoken = req.headers['token']
    if(usrtoken == null){
        res.status(500).send('Token must be provided')
    }else{
        db.query(`SELECT * FROM users WHERE token = '${usrtoken}'`, (err,result)=>{
            if(err) throw err
            
            if(result.length == 0){
                res.status(401).send('Invalid Token')
            }else{
                db.query(`INSERT INTO messeges(user_id, sender_email, sender_name, messege) VALUES ('${result[0].id}','${req.body.email}','${req.body.username}','${req.body.messege}')`, (err,response)=>{
                    if(err) throw err
                    res.json({
                        msg: 'Messege Received'
                    })
                })
            }
        })
    }
})

module.exports = Router