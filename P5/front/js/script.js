// fetching data on the products from the server
fetch('http://localhost:3000/api/products/')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data); 
    makeCards(data); 
  })
  .catch(error => {
    console.log(error);
  }) 


function makeCards(productsArray) {
  const length = productsArray.length;
  const items = document.getElementById('items');

 
  for (let i=0; i<length; i++) {
    let template = `
    <a href="./product.html?id=${productsArray[i]._id}">
    <article>
    <img src="${productsArray[i].imageUrl}" alt="${productsArray[i].altTxt}">
    <h3 class="productName">${productsArray[i].name}</h3>
    <p class="productDescription">${productsArray[i].description}</p>
  </article>
  </a> 
` 
    console.log(productsArray[i]);
    items.insertAdjacentHTML('beforeend',template) 
    
  }
}
  
