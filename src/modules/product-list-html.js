let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price
}) => {
	let $product = $(`<div class="form-check"  data-product-id="${id}" data-name="${name}" data-img-url="${image_url}" data-product-description="${description}" 
		data-price="${price}" data-special-price="${special_price}">
		<input class="form-check-input" type="checkbox" id="gridCheck">
		<label class="form-check-label" for="gridCheck">${name}</label></div>`);
	return $product;
};
 module.exports = _makeHtml; 