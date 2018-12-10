const http = require("http");
const fs = require("fs");
 
http.createServer(function(request, response){
     
    console.log(`Запрошенный адрес: ${request.url}`);
    if(request.url.startsWith("/docs/")){
         
        // получаем путь после слеша
        var filePath = request.url;
        fs.readFile(filePath, function(error, data){
                 
            if(error){
                     
                response.statusCode = 404;
                response.end("Resourse not found!");
            }   
            else{
                response.setHeader("Content-Type", "text/html");
                response.end(data);
            }
        })
    }
    else{
        // во всех остальных случаях отправляем строку hello world!
        response.end("Hello World!");
    }
}).listen(8080);
// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "postgres",
//   database: "database"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var email = "email@gmail.com";
//   var password = "password";
//   var sql = "SELECT * FROM login WHERE email = 'email@gmail.com'";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

// module.exports = con;