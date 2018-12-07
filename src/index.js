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

var _cart_products = [];
var _token = "ngz_9ff2iBb_1-nGt__J";
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
	url: 'https://nit.tron.net.ua/api/product/list',
	method: 'get',
	dataType: 'json',
	success: function(json){
		$('.product-grid').empty();
		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
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
		console.log('wrong');
		setWrongInput('#inputPhone');
	}else setRightInput('#inputPhone');

	if(!validateEmail($('#inputEmail').val())){
		res = false;
		console.log('wrong');
		setWrongInput('#inputEmail');
	}else setRightInput('#inputEmail');

	if($('#inputName').val() == ""){
		res = false;
		console.log('wrong');
		setWrongInput('#inputName');
	}else setRightInput('#inputName');

	if($('#inputSurname').val() == ""){
		res = false;
		console.log('wrong');
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

	console.log($el.hasClass('is-invalid'))
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





AllList(); // create a standart list of all products

jQuery.ajax({
	url: 'https://nit.tron.net.ua/api/category/list',
	method: 'get',
	dataType: 'json',
	success: function(json){
		json.forEach(product => $('#menu').append(_makeMenu(product)));

	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
	},
	
});

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
	var _url = "https://nit.tron.net.ua/api/product/list/category/"+category;
	jQuery.ajax({
		url: _url,
		method: 'get',
		dataType: 'json',
		success: function(json){
			$('.product-grid').empty();
			json.forEach(product => $('.product-grid').append(_makeProduct(product)));

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
		var _post = `name=${_name}&email=${_email}&phone=${_phone}`;
		var counter = 0;
		for(var i = 0; i < _cart_products.length ; i++){
			if(_cart_products[i].ammount > 0){
				_post+=`&products[${_cart_products[i].id}]=${_cart_products[i].ammount}`;
				counter++;
			}
		}

		if(counter == 0) {
			//No products bought!!!

			console.log("0 ammount of products!!!");
			return;
		}
 
		_post+=`&token=ngz_9ff2iBb_1-nGt__J`;
		console.log(_post);

		$.ajax({
		    url: 'https://nit.tron.net.ua/api/order/add',
		    method: 'POST',
		    data:_post,
		    dataType: 'json',
		    success: function(json){
		        console.log(json);
		        _cart_products = [];
		        window.localStorage.setItem('cart_products' , _cart_products);
		        UpdateCart();
		    },
		});

		
	}else {
		//if wrong input 


	}

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