let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $product = $(`<div class="form-check" data-product-id="${id}" data-name="${name}" data-product-description="${description}">
		<input class="form-check-input" type="checkbox" id="gridCheck">
		<label class="form-check-label" for="gridCheck">${name}</label></div>`);
	return $product;
};
 module.exports = _makeHtml; 