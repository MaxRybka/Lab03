let _makeHtml = ({
	id,
	category_name,
	category_products_id
}) => {

	let $product = $(`<a class = "btn menu-btn row col" href = "#" data-category = "${id}" data-products-id = "${category_products_id}">${category_name}</a> `);

	return $product;
};

module.exports = _makeHtml;