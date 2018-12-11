let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $product = $(`<option data-product-id="${id}" data-name="${name}" data-product-description="${description}">${name}<option>`);
	return $product;
};

module.exports = _makeHtml;