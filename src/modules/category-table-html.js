let _makeHtml = ({
	id,
	category_name,
	description
}) => {
	let $product = $(`<tr data-category-id="${id}" data-name="${category_name}" data-category-description="${description}">`);
	$product.append($(` <th scope="row"></th>`).text(id));
	$product.append($(` <td></td>`).text(category_name));
	$product.append($(` <td></td>`).text(description));
	$product.append($(`<td class="tablerow"><div class="col-md-6 butt-table"><button type="button" class="btn btn-primary change-categ-butt" data-toggle="modal" data-target="#editmodalcateg">Change</button></div>
		<div class="col-md-6 butt-table"><button type="button" class=" btn btn-danger category-table-delete-btn ">Delete</button></div></td> `));	
	return $product;
};

module.exports = _makeHtml;