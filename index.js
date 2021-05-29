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

app.get('/', function(req, res){
    res.redirect('/main_login')
})

app.get('/main_login', function(req, res){
    res.sendFile(__dirname+'/html/main_login.html')
    if(req.session.loggedin) res.redirect('/waiting')
    if(req.session.adminlogin) res.redirect('/admin')
})

app.post('/check-login', function(req, res){
    var userName= req.body.name
    var userStNum = req.body.stNum
    var userPW = req.body.pw
    
    if(userName && userStNum && userPW){
        var sql = `SELECT * FROM Users WHERE UserName = '${userName}' AND UserStNum = '${userStNum}' AND UserPwd = '${userPW}'`
        con.query(sql,function(e,result,fields) {
            if (result.length > 0){
                req.session.loggedin = true
                req.session.username = userName;
                console.log(`User ${userName} Connected`)
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

app.get('/user-register', function(req, res){
    res.sendFile(__dirname+'/html/registration.html')
})

app.post('/check-register', function (req, res) {
    console.log(req.body)

    var userName= req.body.name
    var userStNum = req.body.stNum
    var userPhone = req.body.phone
    var userPW = req.body.password

    var params = [userName, userStNum, userPhone, userPW]

    console.log(params)
    if(userName && userStNum && userPW && userPhone){
        var sql = 'INSERT INTO Users (UserName, UserStNum, UserPhone, UserPwd) VALUES (?, ?, ?, ?)'

        con.query(sql, params, function (e, result, fields) {
            if (e === 'ER_DUP_ENTRY') {
                console.log('이미 등록되어있습니다')
                res.redirect('/main_login')
            } else if (e){
                console.log(e)
                res.redirect('/user-register')
            } else {
                req.session.loggedin = true
                req.session.username = userName;
                console.log(`New User ${userName} Connected`)
                res.redirect('/waiting')
            }
        })
    } else {
        console.log("정보를 입력해주세요")
        res.redirect('/user-register')
    }
})

app.get('/waiting', function (req, res) {
    if(req.session.loggedin){
        res.sendFile(__dirname+'/html/waiting_room.html')
    } else {
        console.log('로그인 해주세요')
        res.redirect('/')
    }
})

app.get('/check-admin', function(req,res){
    res.sendFile(__dirname+'/html/adminlock.html')
})

app.post('/check-adminlock', function(req,res){
    if(req.body.adminkey){
        if (req.body.adminkey == "adminpassword"){
            req.session.adminlogin = true
            res.redirect('/admin')
        } else {
            console.log("Attempt of entering admin")
            res.redirect('/')
        }
    }
})

app.get('/admin', function(req,res){
    if (req.session.adminlogin){
        res.sendFile(__dirname+'/html/admin-chatview.html')
    } else {
        console.log("Attempt of entering admin without verification")
        res.redirect('/')
    }
})

app.listen(3000, () => console.log('서버 실행 중...'))