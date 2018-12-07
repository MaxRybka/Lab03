let _makeHtml = ({
	id,
	name,
	description
}) => {

	let $product = $(`<a class = "btn menu-btn row col" href = "#" data-category = "${id}">${name}</a> `);

	return $product;
};

module.exports = _makeHtml;