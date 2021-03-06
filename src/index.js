import './scss/base.scss';
import $ from 'jquery';
import 'bootstrap/js/src/modal.js';
import 'bootstrap/js/src/collapse.js';
import 'jquery-mask-plugin/dist/jquery.mask.js';

window.jQuery = $;
window.$ = $;

let _makeProduct = require('./modules/product-html');
let _makeCartProducts = require('./modules/cart-products-html');
let _makeMenu = require('./modules/menu-html');
let _makeTable = require('./modules/table-html');
let _makeCategoryTable = require('./modules/category-table-html');
let _makeCategoryList = require('./modules/category-list-html');
let _makeProductList = require('./modules/product-list-html');
let _makeOrderTable = require('./modules/order-table-html');


var localIP = "10.0.178.143:8080";
var _cart_products = [];
var _token = "ngz_9ff2iBb_1-nGt__J";
var res=[];
var resproducts=[];

UpdateCartCounter();
window.localStorage.setItem('cart_products' , JSON.stringify(_cart_products));

$(document).ready(function(){
	$('#inputPhone').mask('(000) 000-0000');
});



//!!!----All Functions----!!!\\
function UpdateCartCounter(){
	if(typeof window.localStorage.cart_products !== 'undefined' && window.localStorage.cart_products !== null)
		_cart_products = JSON.parse(window.localStorage.cart_products);
	$('#shop-counter').text(function() {
			var number = 0;
			for (var i = 0; i < _cart_products.length; i++) {
					number++;
			}
			return number == 0 ? "" :number;
	});
}

function UpdateCart(){

	window.localStorage.setItem('cart_products' , JSON.stringify(_cart_products));
	$('.cart-body').empty();
	if(_cart_products.length == 0) $('.cart-body').append('<span class="card col" id="no-product-text">No products in cart<span>');
	else
		JSON.parse(window.localStorage.cart_products).forEach(product => $('.cart-body').append(_makeCartProducts(product)));
	UpdateCartCounter();
	UpdateCartPrice();
}

function UpdateCartPrice(){
	var result = 0;

	for (var i = 0; i < _cart_products.length; i++) {
		result+= (_cart_products[i].price * _cart_products[i].ammount);
	}


	$('#cart-price-number').text(result + "₴");
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function ChangeAmmount(button , index){
	var _id = button.closest('.cart-cardBlock').data('cart-product-id');
	button.siblings('.cart-product-counter').text(function() {	
		var result =+ $(this).text();

		if(result == 0 && index < 0) return result;
		result+=index;

		for(var i = 0 ; i < _cart_products.length ; i++){
			if(_cart_products[i].id == _id) _cart_products[i].ammount = result;
		}

		return result;
	});

	UpdateCart();
}

function AllList(){
	jQuery.ajax({
		url: 'http://'+localIP+'/products',
		method: 'get',
		dataType: 'json',
		success: function(json){
			$('.product-grid').empty();
			console.table(json);
			json.forEach(product => $('.product-grid').append(_makeProduct(product)));
		},
	});
}

function validateEmail(email) {
  var re =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function CheckInput(){
	var res = true;
	
	if($('#inputPhone').val().length != 14){
		res = false;
		setWrongInput('#inputPhone');
	}else setRightInput('#inputPhone');

	if(!validateEmail($('#inputEmail').val())){
		res = false;
		setWrongInput('#inputEmail');
	}else setRightInput('#inputEmail');

	if($('#inputName').val() == ""){
		res = false;
		setWrongInput('#inputName');
	}else setRightInput('#inputName');

	if($('#inputSurname').val() == ""){
		res = false;
		setWrongInput('#inputSurname');
	}else setRightInput('#inputSurname');

	return res;
}

function setWrongInput(el){
	var $el = $(el);
	if(!$el.hasClass('is-invalid')){
		if($el.hasClass('is-valid'))
			$el.addClass('is-invalid').removeClass('is-valid');
		else $el.addClass('is-invalid');

	}
}

function setRightInput(el){
	var $el = $(el);
	if(!$el.hasClass('is-valid')){
		if($el.hasClass('is-invalid'))
			$el.toggleClass('is-invalid is-valid');
		else $el.addClass('is-valid');
	}
}

function UpdateProductTable(){
	jQuery.ajax({
		url: 'http://'+localIP+'/products',
		method: 'get',
		dataType: 'json',
		success: function(json){
			json.forEach(product => $('.product-table').append(_makeTable(product)));
		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		},
		
	});
}


function UpdateEl(_url , el , make){ // get information from db and updates el
	var $el = $(el);
	if(el != '#menu') $el.empty();
	jQuery.ajax({
		url: _url,
		method: 'get',
		dataType: 'json',
		success: function(json){
			json.forEach(product => $el.append(make(product)));
		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		},
		
	});
}

UpdateEl('http://'+localIP+'/orders' , '.order-table' , _makeOrderTable);
UpdateEl('http://'+localIP+'/products' , '.product-table' , _makeTable); // updating product table
UpdateEl('http://'+localIP+'/category' , '#menu' , _makeMenu); // updating menu categories
UpdateEl('http://'+localIP+'/category' , '.category-table' ,  _makeCategoryTable);
// UpdateEl( 'http://'+localIP+'/category' , '.category-list' ,_makeCategoryList);
UpdateEl('http://'+localIP+'/products' , '.product-list' , _makeProductList);
// jQuery.ajax({
// 	url: 'https://nit.tron.net.ua/api/category/list',
// 	method: 'get',
// 	dataType: 'json',
// 	success: function(json){
// 		// json.forEach(product => $(console.log(product)));
// 		json.forEach(product => $('.category-list').append(_makeCategoryList(product)));
// 	},
// 	error: function(xhr){
// 		alert("An error occured: " + xhr.status + " " + xhr.statusText);
// 	},
	
// });
// jQuery.ajax({
// 	url: 'https://nit.tron.net.ua/api/product/list',
// 	method: 'get',
// 	dataType: 'json',
// 	success: function(json){
// 		json.forEach(product => $('.product-list').append(_makeProductList(product)));
// 	},
// 	error: function(xhr){
// 		alert("An error occured: " + xhr.status + " " + xhr.statusText);
// 	},
	
// });
AllList(); // create a standart list of all products

// jQuery.ajax({
// 	url: 'https://nit.tron.net.ua/api/product/list',
// 	method: 'get',
// 	dataType: 'json',
// 	success: function(json){
// 		json.forEach(product => $('#menu').append(_makeMenu(product)));

// 	},
// 	error: function(xhr){
// 		alert("An error occured: " + xhr.status + " " + xhr.statusText);
// 	},
	
// });


$(document).on('click' , '.cart-minus-button', function(){
	ChangeAmmount($(this) , -1);
});


$(document).on('click' , '.cart-plus-button', function(){
	ChangeAmmount($(this) , +1);
});

$(document).on('click' , '.cardBlock .buy-btn' , function(){
	if(storageAvailable('localStorage')){
		var _id = $(this).closest('.cardBlock').data('product-id');
		var _name = $(this).closest('.cardBlock').data('name');
		var _image_url = ($(this).closest('.cardBlock').data('img-url'));
		var _price = $(this).closest('.cardBlock').data('price');

		if($(this).closest('.cardBlock').data('special-price') != null) _price = $(this).closest('.cardBlock').data('special-price');

		var product = { id: _id , ammount: 1 , name: _name , image_url : _image_url , price : _price};

		if(_cart_products.length == 0){
			_cart_products.push(product);
		}
		else{
			for (var i = 0; i< _cart_products.length;i++) {
				if(_cart_products[i].id == product.id){
					_cart_products[i].ammount++;
					break;
				}
				else if(i == (_cart_products.length -1)){
					_cart_products.push(product);
					break;
				}
			}
		}

		UpdateCart();//updating counter on cart

	}else console.log('Storage Not Available!!!!!');
});

$(document).on('click' , '#cart-button', function(){
	UpdateCart();
});

$(document).on('click' , '.cart-product-delete', function(){
	var _id = $(this).closest('.cart-cardBlock').data('cart-product-id');

	for(var i =0  ; i <_cart_products.length ; i++ ){
		if(_cart_products[i].id == _id) {
			_cart_products.splice(i,1);
		}
	}

	UpdateCart();
});


function menuOn(){
	$('#menu').css("width" , "250px");
	$('#main').css("background-color" , "rgba(0,0,0,0.4)");
	$('#main').css("pointer-events" , "auto");
}

function menuOff(){
	$('#menu').css("width" , "0px");
	$('#main').css("background-color" , "rgba(0,0,0,0)");
	$('#main').css("pointer-events" , "none");
}

$(document).on('click' , '.navbar-toggler', function(){
	menuOn();
});

$(document).on('click' , '#close-menu-btn', function(){
	menuOff();
});

$(document).on('click' , '#main' , function(){
	menuOff();
});

$(document).on('click' , '.menu-all-btn' , function(){
	AllList();
	menuOff();
});

$(document).on('click' , '.menu-btn' , function(){
	var category = $(this).data('category');
	var products_id = $(this).data('products-id').split(',').map(Number);
	jQuery.ajax({
		url: 'http://'+localIP+'/products',
		method: 'get',
		dataType: 'json',
		success: function(json){
			$('.product-grid').empty();
			json.forEach(function(product){
				for(var i=0; i < products_id.length ; i++){
					if(product.id ==  products_id[i])
					$('.product-grid').append(_makeProduct(product))
				}
			});

		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
		},
		
	});

	menuOff();

});

$(document).on('click', '.close-product-info' , function(){

	$(this).closest('.cardBlock').find('.product-info').css('color','rgba(0,0,0,0)');
	$(this).closest('.cardBlock').find('.product-info').css('background-color','rgba(255,255,255,0)');
	$(this).closest('.cardBlock').find('.product-info').css('pointer-events','none');
	$(this).closest('.cardBlock').find('.close-product-info').css('visibility','hidden');
	$(this).closest('.cardBlock').find('.product-info-text').css('overflow-y','hidden');

});

$(document).on('click' , '.more-btn' , function(){

	// $(this).closest('.cardBlock').find('.product-info').css('top','100%');
	$(this).closest('.cardBlock').find('.product-info').css('color','rgba(0,0,0,1)');
	$(this).closest('.cardBlock').find('.product-info').css('background-color','rgba(255,255,255,1)');
	$(this).closest('.cardBlock').find('.product-info').css('pointer-events','auto');
	$(this).closest('.cardBlock').find('.close-product-info').css('visibility','visible');
	$(this).closest('.cardBlock').find('.product-info-text').css('overflow-y','auto');
});

var orderActive = false;


$(document).on('click' , '#primary-order-btn' , function(){
	if(!orderActive  && _cart_products.length != 0) {
		orderActive = true;
		$(this).text("Confirm");
		$('#secondary-order-btn').text("Back");
		$(this).css('background-color','#17c417')
		$('.order-change').collapse('toggle');

	}else if(orderActive  && _cart_products.length != 0 && CheckInput()){
		$('#cartModal').modal('toggle');

		$('.order-change').collapse('toggle');
		orderActive = false;
		$(this).text("Order");
		$('#secondary-order-btn').text("Close");
		$(this).css('background-color','#1f5dc6')

		var _name = $('#inputName').val()+" "+$('#inputSurname').val();
		var _phone = $('#inputPhone').val();
		var _email = $('#inputEmail').val();

		var counter = 0;
		var _products = '';
		for(var i = 0; i < _cart_products.length ; i++){
			if(_cart_products[i].ammount > 0){
				_products+=`&products[${_cart_products[i].id}]=${_cart_products[i].ammount}`;
				counter++;
			}
		}

		if(counter == 0) {
			//No products bought!!!

			console.log("0 ammount of products!!!");
			return;
		};

 
		var _post = {
				name: _name,
                phone: _phone,
                email: _email,
                products: _products
		};

		$.ajax({
		    url: 'http://'+localIP+'/purchase/add',
		    method: 'POST',
		    dataType: 'json',
		    data:JSON.stringify(_post),
		    contentType: "application/json",
            cache: false,
            timeout: 5000,
		    success: function(json){
		        _cart_products = [];
		        window.localStorage.setItem('cart_products' , _cart_products);
		        UpdateCart();
		    },
		});

		UpdateEl('http://'+localIP+'/orders' , '.order-table' , _makeOrderTable);

		
	}else {
		//if wrong input 


	}

});

function CorrectLogin (){
	var _login= $('#logininput').val();
	var _pass= $('#passwordinput').val();
	//Test input -------------------------------
	var res = false;
	$.ajax({
	    url: 'http://'+localIP+'/login',
	    method: 'GET',
	    async: false,
	    data:{
			login : _login,
			pass : _pass
		},
		timeout: 10000,
	    success: function(json){
	    	if(json.length !=0){
		    	console.log("Correct");
		        res = true;

		    }
	    	else{
	    		console.log("Incorrect");
				res = false;
	    	}
	    	
	    },
	});
	return res;
};

$(document).on('click' , '#sign-in' , function(){
	if(CorrectLogin()){
		$('.product-grid').empty();
		$('.admin-panel').removeClass('d-none');
		$( "#adminmodal" ).remove();
		$( "#cart-button" ).before( `<button class="btn alert-danger admin-sign-out">
				Sign Out
			</button> `);
	}
	
});

$(document).on('click' , '.admin-sign-out' , function(){
	AllList();
	$('.admin-panel').addClass('d-none');
	$( "#cart-button" ).before( `<button class="btn " id="adminmodal" data-toggle="modal" data-target="#adminModal">
				Login
			</button> `);
	$( ".admin-sign-out" ).remove();
});

$(document).on('click' , '#secondary-order-btn' , function(){
	if(orderActive){
		$('.order-change').collapse('toggle');
		orderActive = false;
		$('#primary-order-btn').text("Order");
		$(this).text("Close");
		$('#primary-order-btn').css('background-color','#1f5dc6')
	}else{
		$('#cartModal').modal('toggle');
	}
});

$(document).on('click' , '#create-product-btn' , function(){


		var _name = $('#create-product-name').val();
		var _description = $('#create-product-description').val();
		var _image_url = $('#create-product-photo').val();
		var _price = $('#create-product-price').val();
		var _special_price = $('#create-product-special-price').val();
		
		console.log(_name);
		console.log(_description);
		console.log(_image_url);
		console.log(_price);
		console.log(_special_price);

		var _post = {
				name: _name,
                description: _description,
                image_url: _image_url,
                price: _price,
                special_price : _special_price
		};

		
		$.ajax({
		    url: 'http://'+localIP+'/products/add',
		    method: 'POST',
		    dataType: 'json',
		    data:JSON.stringify(_post),
		    contentType: "application/json",
            cache: false,
            timeout: 5000,
		    success: function(json){
		        
		    },
		});


		UpdateEl('http://'+localIP+'/products' , '.product-table', _makeTable); // updating product table
});


//zalupa start

$(document).on('click' , '#gridCheck' , function(){
  var check=false;
  var id = $(this).closest('[data-category-id]').data('category-id');
  if(id==undefined)return;
  console.log(id)
  if(res==null){res.push(id)};
  for(var i=0;i<res.length;i++){
    if(res[i]==id){check=true;res.splice(i,1);break;}
  }
  if(!check){res.push(id)}
  console.log(res);
});


$(document).on('click' , '#gridCheck' , function(){
  var check=false;
  var id = $(this).closest('[data-product-id]').data('product-id');
  if(id==undefined)return;
  console.log(id)
  if(resproducts==null){resproducts.push(id)};
  for(var i=0;i<resproducts.length;i++){
    if(resproducts[i]==id){check=true;resproducts.splice(i,1);break;}
  }
  if(!check){resproducts.push(id)}
  console.log(resproducts);
});

//zalupa end

$(document).on('click' , '#category-add-btn' , function(){ // posting new category
	var _name = $('#create-category-name').val();
	var _products_id = resproducts.join(',');
	var _description = $('#create-category-description').val();
	resproducts = [];

	$.ajax({
		    url: 'http://'+localIP+'/category/add',
		    type: 'POST',
		    data: {
		    	category_name : _name,
		    	category_products_id : _products_id ,
		    	description : _description
		    },
		    success: function(result){
		        
		    },
	});

	UpdateEl('http://'+localIP+'/category' , '.category-table', _makeCategoryTable); // updating product table
});

$(document).on('click' , '.category-table-delete-btn' , function(){
	var id = $(this).closest('[data-product-id]').data('product-id');

	$.ajax({
		    url: 'http://'+localIP+'/category/delete/'+id,
		    type: 'POST',
		    data: {_method: 'delete', _id :id},
		    success: function(result){
		        
		    },
	});

	UpdateEl('http://'+localIP+'/category' , '.category-table', _makeCategoryTable); // updating product table
});

$(document).on('click' , '.product-table-delete-btn' , function(){
	var id = $(this).closest('[data-product-id]').data('product-id');

	$.ajax({
		    url: 'http://'+localIP+'/products/delete/'+id,
		    type: 'POST',
		    data: {_method: 'delete', _id :id},
		    success: function(result){
		        
		    },
	});

	UpdateEl('http://'+localIP+'/products' , '.product-table', _makeTable); // updating product table
});

var product_id;
$(document).on('click' , '.change-product-butt', function(){
	product_id = $(this).closest('tr').data('product-id');
	$("#edit-product-name").attr("value",$(this).closest('tr').data('name'));
	$("#edit-product-price").attr("value",$(this).closest('tr').data('price'));
	$("#edit-product-special-price").attr("value",$(this).closest('tr').data('special-price'));
	$("#edit-product-image").attr("value",$(this).closest('tr').data('img-url'));
	$("#edit-product-description").empty();
	$("#edit-product-description").append($(this).closest('tr').data('product-description'));
	
});

var category_id;
$(document).on('click' , '.change-categ-butt', function(){
	category_id = $(this).closest('tr').data('category-id');
	$("#edit-category-name").val('');
	$("#edit-category-name").attr("value",$(this).closest('tr').data('name'));
	// $("#edit-category-name").val($(this).closest('tr').data('name'));
	console.log($(this).closest('tr').data('name'));
	$("#edit-category-description").empty();
	console.log($(this).closest('tr').data('category-description'));
	$("#edit-category-description").append($(this).closest('tr').data('category-description'));
});

$(document).on('click' , '#product-save-btn' , function(){
	 console.log("ID : " + product_id);
	 $.ajax({
	 	url: 'http://'+localIP+'/products/edit/',
	    type: 'POST',
	    data: {
	    	id : product_id,
	    	name : $('#edit-product-name').val(),
	    	description : $('#edit-product-description').val(),
	    	image_url : $('#edit-product-photo').val(),
	    	price : $('#edit-product-price').val(),
	    	special_price : $('#edit-product-special-price').val()

	    },
	    success: function(result){
	        
	    },
	 });

	 UpdateEl('http://'+localIP+'/products' , '.product-table', _makeTable);
});

$(document).on('click' , '#category-save-btn' , function(){
	 console.log("ID : " + category_id);
	 $.ajax({
	 	url: 'http://'+localIP+'/category/edit/',
	    type: 'POST',
	    data: {
	    	id : category_id,
	    	category_name : $('#edit-category-name').val(),
	    	description : $('#edit-category-description').val(),
	    	category_products_id : resproducts.join(',')
	    },
	    success: function(result){
	        
	    },
	 });
	 resproducts = [];

	UpdateEl('http://'+localIP+'/category' , '.category-table', _makeCategoryTable);
});