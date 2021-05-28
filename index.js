var mysql = require('mysql')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var app = express()

app.use(express.static(__dirname))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

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

app.post('/check-login', function(req, res){
    console.log(req.body)
    var userName= req.body.name
    var userStNum = req.body.stNum
    var userPW = req.body.pw
    if(userName && userStNum && userPW){
        con.query(`SELECT * FROM Users WHERE UserName = '${userName}' AND UserStNum = '${userStNum}' AND UserPwd = '${userPW}'`,function(e,result,fields) {
            if (res){
                req.session.loggedin = true
                req.session.username = userName;
                res.redirect('/waiting')
            } else {
                console.log('등록이 되어있지 않습니다. \n로그인 정보를 확인해주시거나 등록하세요.')
                res.redirect('/main_login')
            }
        })
    } else {
        console.log('정보를 입력해주세요')
        res.redirect('/main_login')
    }
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

app.get('/waiting', function (req, res) {
    if(req.session.loggedin){
        res.sendFile(__dirname+'/html/waiting_room.html')
    } else {
        console.log('로그인 해주세요')
        res.redirect('/')
    }
})

app.listen(3000, () => console.log('서버 실행 중...'))