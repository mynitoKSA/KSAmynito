var mysql = require('mysql')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.listen(3000, 'localhost', function () {
    console.log('서버 실행 중...')
})

var con = mysql.createConnection({
    host: "mynito-db.cqxwiqzo0ydz.ap-northeast-2.rds.amazonaws.com",
    user: "mynitoadmin",
    database: "mynitodb",
    password: "mynito20",
    port: 3306
})

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "mynitodb",
//     password: "aoddl2005",
// })

app.get('/', function(req, res){
    res.redirect('/main_login')
})
app.get('/main_login', function(req, res){
    res.sendFile(__dirname+'/html/main_login.html')
})
app.post('/user-register', function (req, res) {
    console.log(req.body)
    var userName= req.body.name
    var userStNum = req.body.stNum
    var userPhone = req.body.phonenumber
    var userPW = req.body.password

    var sql = 'INSERT INTO Users (UserName, UserStNum, UserPhone, UserPwd) VALUES (?, ?, ?)'
    var params = [userName, userStNum, userPhone, userPW]

    con.query(sql, params, function (err, rows, fields) {
        var resultCode = 404
        var message = '에러가 발생했습니다'
        
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            resultCode = 200
            message = '성공'
            res.redirect('/waiting')
        }
        
        res.json({
            'code': resultCode,
            'message': message
        })
    })
    res.sendFile(__dirname+'/html/registration.html')
})