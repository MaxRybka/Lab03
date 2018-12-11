let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $product = $(`<tr data-product-id="${id}" data-name="${name}" data-product-description="${description}">`);
	$product.append($(` <th scope="row"></th>`).text(id));
	$product.append($(` <td></td>`).text(name));
	$product.append($(` <td></td>`).text(description));
	$product.append($(`<td class="tablerow"><div class="col-md-6 butt-table"><button type="button" class="btn btn-primary " >Change</button></div>
		<div class="col-md-6 butt-table"><button type="button" class=" btn btn-danger product-table-delete-btn ">Delete</button></div></td> `));	
	return $product;
};

module.exports = _makeHtml;