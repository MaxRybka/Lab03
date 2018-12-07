let _makeHtml = ({
	id,
	ammount,
	name,
	image_url,
	price,
}) => {

	let $product = $(`<div class="card col-xs-12 col-sm-11 col-md-10 cart-cardBlock" data-cart-product-id="${id}"> `);
	$product.append($(`<button class="btn btn-danger cart-product-delete"></button>`));
	$product.append($(`<img src="${image_url}" class="card-img-top cart-product-image">`));
	$product.append($(`<h5 class="card-title cart-product-title">Card title</h5>`).text(name));
	$product.append($(`<h4 class="card-title cart-product-price">Card title</h4>`).text(price + "₴"));
	$product.append($(`<div class = "row cart-counter justify-content-center"> 
						<button class="btn btn-light col-2 cart-minus-button">-</button>
						<span class="alert alert-secondary col-2 cart-product-counter">${ammount}</span> 
						<button class="btn btn-light col-2 cart-plus-button">+</button> 
					</div>`));


	return $product;
};

module.exports = _makeHtml;