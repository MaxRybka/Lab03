let _makeHtml = ({
	id,
	name,
	email,
	phone,
	products
}) => {
	let $product = $(`<tr class="tr-product" data-product-id="${id}" data-name="${name}"  data-product-email="${email}" data-phone="${phone}" data-products="${products}">`);
	$product.append($(` <th  scope="row"></th>`).text(id));
	$product.append($(` <td></td>`).text(name));
	$product.append($(` <td></td>`).text(email));
	$product.append($(` <td></td>`).text(phone));
	$product.append($(` <td></td>`).text(products));
	return $product;
};

module.exports = _makeHtml;