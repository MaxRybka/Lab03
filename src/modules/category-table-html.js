let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $product = $(`<tr data-product-id="${id}" data-name="${name}" data-product-description="${description}">`);
	$product.append($(` <th scope="row"></th>`).text(id));
	$product.append($(` <td></td>`).text(name));
	$product.append($(` <td></td>`).text(description));
	$product.append($(`<td><button type="button" class="btn btn-primary " >Change</button></td>`));	
	$product.append($(` <td><button type="button" class="btn btn-danger ">Delete</button></td>`))
	return $product;
};

module.exports = _makeHtml;