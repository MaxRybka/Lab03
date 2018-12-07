let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price
}) => {
	let $product = $(`<div class="card col-xs-12 col-sm-4 col-md-3 cardBlock" 
	 data-product-id="${id}" data-name="${name}" data-img-url="${image_url}" data-product-description="${description}" data-price="${price}" data-special-price="${special_price}">`);
	$product.append($(`<img src="${image_url}" alt="${name}" class="card-img-top product-image">`));
	$product.append($(`<div class="card-body ">`));
	$product.append($(`<h5 class="card-title product-title">Card title</h5>`).text(name));
	$product.append($(`<span class="card-title product-price badge">No price</span>`).text(price + "₴"));
	$product.append($('<div class = "card-title text-center"><span class="product-special-price badge alert-danger "></span></div>'));

	$($product).find(`.product-price`).text(price + "₴");

	$product.append($(`<div class = "row product-buttons-block">
						<button type="button" class="btn btn-outline-primary more-btn col" >More</button>

						<button type="button" class="btn btn-outline-primary buy-btn col">Buy</button>
					   </div>`));


	$product.append($(`<div class = "product-info card">
						<span class="product-info-text">${description}</span>
						<div class = "btn btn-outline-dark close-product-info">Back</div>
						</div>`));




	if(special_price != null) {
		$($product).find(`.product-special-price`).text(special_price + "₴");
		$($product).find(`.product-price`).css('text-decoration','grey line-through');
		$($product).find(`.product-price`).css('color','#969696');
	}


	return $product;
};

module.exports = _makeHtml;