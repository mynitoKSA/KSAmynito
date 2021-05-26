const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "mynito-db.cqxwiqzo0ydz.ap-northeast-2.rds.amazonaws.com",
    user: "mynitoadmin",
    database: "mynitodb",
    password: "mynito20",
    port: "3306"
});

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.post('/users', function(req, res) {
    console.log(req.body)
    var userName= req.body.name
    var userStNum = req.body.stNum
    var userPhone = req.body.phonenumber
    var userPW = req.body.password

    var sql = 'INSERT INTO Users (UserName, UserStNum, UserPhone, UserPwd) VALUES (?, ?, ?)'
    // var sql = `INSERT INTO Users (UserName, UserStNum, UserPhone, UserPwd) VALUES ('${req.query.name}', '${req.query.email}', '${req.query.phone}', '${req.query.pw}')`
    var params = [userName, userStNum, userPhone, userPW]

    con.query(sql, params, function (err, result) {
        var resultCode = 404
        var message = '에러가 발생했습니다'
        
        if (err) {
            console.log(err)
        } else {
            resultCode = 200
            message = '성공'
        }
        
        res.json({
            'code': resultCode,
            'message': message
        })
    })
})

// app.post('/users', (req, res) => {
//     if (req.query.name && req.query.stNum && req.query.phone && req.query.pw) {
//         console.log('Request received')
//         con.connect(function (err) {
//             con.query(`INSERT INTO main.users (UserName, UserStNum, UserPhone, UserPwd) VALUES ('${req.query.name}', '${req.query.email}', '${req.query.phone}', '${req.query.pw}')`, function(err, result, fields) {
//                 if (err) res.send(err)
//                 if (result) res.send({
//                     UserName: req.query.name,
//                     UserStNum: req.query.stNum,
//                     UserPhone: req.query.phone,
//                     UserPwd: req.query.pw
//                 })
//                 if (fields) console.log(fields)
//             })
//         })
//     } else {
//         console.log('Missing a parameter')
//     }
// })