const mysql = require('mysql');

const con = mysql.createConnection({
    host: "mynito-db.cqxwiqzo0ydz.ap-northeast-2.rds.amazonaws.com",
    user: "mynitoadmin",
    password: "mynito20",
    database: "mynitodb",
    port: 3306,
    connectTimeout: 30000
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected");
    con.end();
});