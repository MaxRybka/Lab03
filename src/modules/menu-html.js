let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $product = $(`<a class = "btn menu-btn row col" href = "#" data-product-id="${id}" data-name="${name}" data-product-description="${description}">`);
	$product.append($(`<a></a>`).text(name));
	return $product;
};

module.exports = _makeHtml;