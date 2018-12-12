let _makeHtml = ({
	id,
  category_name,
  description
}) => {
  let $product = $(`<div class="form-check" data-category-id="${id}" data-name="${category_name}" data-product-description="${description}">
    <input class="form-check-input categ-input" type="checkbox" id="gridCheck" value="${id}">
    <label class="form-check-label" for="gridCheck">${category_name}</label></div>`);
  return $product;
};
 module.exports = _makeHtml;