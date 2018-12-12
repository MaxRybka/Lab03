var express = require("express"),
	app = express(),
	http = require('http'),
    path = require('path'),
    multer = require('multer'),
	bodyParser=require("body-parser"),
	mysql= require('mysql'),
	jsonParser = express.json();

// app.use(express.bodyParser());
app.use(jsonParser);
app.use(express.static(__dirname) , function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const DIR = './uploads';


var con = mysql.createConnection({
	host : 'localhost',
	user: 'root',
	password : 'postgres',
	database: 'database'
});

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage})


app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

con.connect(function(err){
	if(err) console.log(err);
	else console.log("Connected!");
});


app.listen(8080,function(){
	console.log("Server running at port 8080...");
});

app.get('/login' , function(req,res){
	con.query('SELECT * FROM login' , function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

app.get('/products' , function(req,res){
	con.query('SELECT * FROM products' , function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

app.get('/category' , function(req,res){
	con.query('SELECT * FROM category' , function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

//adding purchase information
app.post('/purchase/add' , function(req,res){
	let emp = req.body;
	var sql = "INSERT INTO purchase (name, phone , email , products)  VALUES (?,?,?,?)";
	con.query(sql,[emp.name,emp.phone,emp.email,emp.products], function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});


//adding product to database
app.post('/products/add' ,upload.single('image'), function(req,res){
	let emp = req.body;
	var sql = "INSERT INTO products (name, description , image , price , special_price)  VALUES (?,?,?,?,?)";

	con.query(sql,[emp.name,emp.description , emp.image , emp.price , emp.special_price], function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

app.post('/upload-image',upload.single('image'), function (req, res) {
  message : "Error! in image upload."
    if (!req.file) {
        console.log("No file received");
          message = "Error! in image upload."
        res.render('index',{message: message, status:'danger'});
    
      } else {
        console.log('file received');
        console.log(req);
        var sql = "INSERT INTO `file`(`name`, `type`, `size`) VALUES ('" + req.file.filename + "', '"+req.file.mimetype+"', '"+req.file.size+"')";
        con.query(sql, function(err, result) {
           console.log('inserted data');
        });
        message = "Successfully! uploaded";
        res.render('index',{message: message, status:'success'});

      }
});

//deleteing product
app.post('/products/delete/:id', function(req,res){
	console.log("Deleting product : " + req.params.id);
	var sql = "DELETE FROM products WHERE id = "+ req.params.id;
	con.query(sql, function(err, result){
		if(err) console.log(err);
		else console.log("Success");
	});
});

app.post('/products/edit/:id' , function(req,res){
	let emp = req.body;
	var sql = "UPDATE products SET ? WHERE id = ";
	con.query(sql,[emp.name,emp.phone,emp.email,emp.products], function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});




// получение списка данных
// app.get("/products", function(req, res){
//     var content = fs.readFileSync("products.json", "utf8");
//     var products = JSON.parse(content);
//     res.send(products);
// });
// // получение одного пользователя по id
// app.get("/products/:id", function(req, res){
      
//     var id = req.params.id; // получаем id
//     var content = fs.readFileSync("products.json", "utf8");
//     var users = JSON.parse(content);
//     var user = null;
//     // находим в массиве пользователя по id
//     for(var i=0; i<users.length; i++){
//         if(users[i].id==id){
//             user = users[i];
//             break;
//         }
//     }
//     // отправляем пользователя
//     if(user){
//         res.send(user);
//     }
//     else{
//         res.status(404).send();
//     }
// });
// // получение отправленных данных
// app.post("/products", jsonParser, function (req, res) {
     
//     if(!req.body) return res.sendStatus(400);
     
//     var userName = req.body.name;
//     var userAge = req.body.age;
//     var user = {name: userName, age: userAge};
     
//     var data = fs.readFileSync("products.json", "utf8");
//     var users = JSON.parse(data);
     
//     // находим максимальный id
//     var id = Math.max.apply(Math,users.map(function(o){
//     	return o.id;
//     }))
//     // увеличиваем его на единицу
//     user.id = id+1;
//     // добавляем пользователя в массив
//     users.push(user);
//     var data = JSON.stringify(users);
//     // перезаписываем файл с новыми данными
//     fs.writeFileSync("products.json", data);
//     res.send(user);
// });
//  // удаление пользователя по id
// app.delete("/products/:id", function(req, res){
      
//     var id = req.params.id;
//     var data = fs.readFileSync("products.json", "utf8");
//     var users = JSON.parse(data);
//     var index = -1;
//     // находим индекс пользователя в массиве
//     for(var i=0; i<users.length; i++){
//         if(users[i].id==id){
//             index=i;
//             break;
//         }
//     }
//     if(index > -1){
//         // удаляем пользователя из массива по индексу
//         var user = users.splice(index, 1)[0];
//         var data = JSON.stringify(users);
//         fs.writeFileSync("products.json", data);
//         // отправляем удаленного пользователя
//         res.send(user);
//     }
//     else{
//         res.status(404).send();
//     }
// });
// // изменение пользователя
// app.put("/products", jsonParser, function(req, res){
      
//     if(!req.body) return res.sendStatus(400);
     
//     var userId = req.body.id;
//     var userName = req.body.name;
//     var userAge = req.body.age;
     
//     var data = fs.readFileSync("products.json", "utf8");
//     var users = JSON.parse(data);
//     var user;
//     for(var i=0; i<users.length; i++){
//         if(users[i].id==userId){
//             user = users[i];
//             break;
//         }
//     }
//     // изменяем данные у пользователя
//     if(user){
//         user.age = userAge;
//         user.name = userName;
//         var data = JSON.stringify(users);
//         fs.writeFileSync("products.json", data);
//         res.send(user);
//     }
//     else{
//         res.status(404).send(user);
//     }
// });
  
// app.listen(8080, function(){
//     console.log("Сервер ожидает подключения...");
// });