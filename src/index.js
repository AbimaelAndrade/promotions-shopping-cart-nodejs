const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

function getProducts(ids, productsList) {
	const products = productsList.reduce((acumulator, product) =>{
		if(ids.includes(product.id)){
			acumulator.push(product)
		}

		return acumulator;
	},[]);

	return products;
}

function productsItems(products) {
	const items = products.reduce((acumulator, product) =>{
		const {name, category} = product;
		return [...acumulator, {name, category}];
	},[]);

	return items;
}

function countProductsByCategory(products){
	const categoriesCount = products.reduce((acumulator, product) =>{
		const { category } = product

		if(!acumulator[category]){
			acumulator[category] = 1;
		}else{
			acumulator[category] += 1;
		}

		return acumulator;
	}, {});

	return categoriesCount;
}

function getPromotion(counter) {
	const qtdCategory = Object.values(counter).length;

	switch(qtdCategory){
		case 1:
			return promotions[0];
		case 2:
			return promotions[1];
		case 3:
			return promotions[2];
		default:
			return promotions[3]
	}
}

function sumRegularPrice(products){
	return products
		.reduce((acumulator, product) => acumulator += product.regularPrice, 0)
		.toFixed(2);
}

function getPricePromotion(promotion, product) {
	let price = 0;

	product.promotions.map(item => {
		if(item.looks.includes(promotion)){
			price = item.price
		}
	});

	if(!price){
		return product.regularPrice;
	}

	return price;	
}

function getTotalPrice(products) {
	return (promotion) => {
		const regularPrice = products.reduce((acumulator, product) => {
			const price = getPricePromotion(promotion, product);
	
			return acumulator += price;
		},0);

		return regularPrice.toFixed(2);
	}	
}

function getDiscount(totalOrder, discount){
	return `${((discount * 100)/totalOrder).toFixed(2)}%`;
}

function getShoppingCart(ids, productsList) {
	const products = getProducts(ids, productsList);
	const items = productsItems(products);
	const counter = countProductsByCategory(items);
	const promotion = getPromotion(counter);

	const totalWithoutPromotion = sumRegularPrice(products);
	const totalPrice = getTotalPrice(products)(promotion);
	const discountValue = (totalWithoutPromotion - totalPrice).toFixed(2);
	const discount = getDiscount(totalWithoutPromotion, discountValue);
	
	const order = {
		products: items,
		promotion,
		totalPrice,
		discountValue,
		discount,
	}

	return order;
}

module.exports = { getShoppingCart };