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
	let emp = req.query;
	console.log("Log : " + emp.login);
	console.log("Pas : " + emp.pass);
	var sql = "SELECT * FROM login WHERE email = '"+emp.login+"' AND password = '"+emp.pass+"'";
	con.query(sql,function(err,rows,fields){
		if(err) {
			console.log(err);
		}
		else{
			res.send(rows);
		} 
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

app.get('/orders', function(req,res){
	con.query('SELECT * FROM purchase' , function(err,rows,fields){
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
app.post('/products/add', function(req,res){
	let emp = req.body;
	var sql = "INSERT INTO products (name, description , image_url , price , special_price)  VALUES (?,?,?,?,?)";

	con.query(sql,[emp.name,emp.description , emp.image_url , emp.price , emp.special_price], function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

app.post('/category/add', function(req,res){
	let emp = req.body;
	var sql = "INSERT INTO category (category_name, category_products_id , description)  VALUES (?,?,?)";

	con.query(sql,[emp.category_name,emp.category_products_id , emp.description], function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
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

app.post('/category/delete/:id', function(req,res){
	console.log("Deleting ctegory : " + req.params.id);
	var sql = "DELETE FROM category WHERE id = "+ req.params.id;
	con.query(sql, function(err, result){
		if(err) console.log(err);
		else console.log("Success");
	});
});

app.post('/products/edit' , function(req,res){
	let emp = req.body;
	var sql = "UPDATE products SET name  = '"+emp.name+"' , description  = '"+emp.description+"' , image_url  = '"+emp.image_url+"' , price  = "+emp.price+" , special_price = "+emp.special_price+" WHERE id = "+emp.id;
	con.query(sql, function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});

app.post('/category/edit' , function(req,res){
	let emp = req.body;
	var sql = "UPDATE category SET category_name  = '"+emp.category_name+"', category_products_id = '"+emp.category_products_id+"' , description  = '"+emp.description+"' WHERE id = "+emp.id;
	con.query(sql, function(err,rows,fields){
		if(err) console.log(err);
		else res.send(rows);
	});
});