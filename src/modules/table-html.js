let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price
}) => {
	let $product = $(`<tr data-product-id="${id}" data-name="${name}" data-img-url="${image_url}" data-product-description="${description}" data-price="${price}" data-special-price="${special_price}">`);
	$product.append($(` <th scope="row"></th>`).text(id));
	$product.append($(` <td></td>`).text(name));
	$product.append($(` <td></td>`).text(price));
	if(special_price==null)special_price="-";
	$product.append($(` <td></td>`).text(special_price));
	$product.append($(`<td><button type="button" class="btn btn-primary " >Change</button></td>`));	
	$product.append($(` <td><button type="button" class="btn btn-danger product-table-delete-btn ">Delete</button></td>`))
	return $product;
};

module.exports = _makeHtml;