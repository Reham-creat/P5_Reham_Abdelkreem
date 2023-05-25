//returns the url of the current page
const _id = new URL(window.location.href).searchParams.get('id');
console.log(_id);

let cartString = localStorage.getItem('cart') || '[]';

let cartArray = JSON.parse(cartString); 

const prodObject = {
    _id: '',
    name: '',
    imageUrl: '',
    altTxt: '',
    color: '',
    quantity: 1
}

fetch('http://localhost:3000/api/products/' + _id) 
    .then(response => response.json())
    .then(data => {
        console.log(data);
        makeProductCard(data);
        initProdObject(data);
    })
    .catch(error => console.log(error));
  
function makeProductCard(obj) {
   
    const prodImg = document.querySelector('.item__img');
    const prodDescription = document.getElementById('description'); 
    const prodPrice = document.getElementById('price');
    const prodTitle = document.getElementById('title');
    const prodQuantity = document.getElementById('quantity');
    const addBtn = document.getElementById('addToCart');
    const prodColors = document.getElementById('colors');

    const itemImg = document.createElement('img');
    itemImg.setAttribute('src', obj.imageUrl);
    itemImg.setAttribute('alt', obj.altTxt);
    prodImg.appendChild(itemImg);

   
    prodPrice.innerHTML = obj.price;
    prodTitle.innerHTML = obj.name;
    prodDescription.innerHTML = obj.description;

    quantity.addEventListener('change', updateQuantity); 

    addBtn.addEventListener('click', addToCart); 
  

    for (let i=0; i < obj.colors.length; i++) {
        const pulldown = document.createElement('option');
        pulldown.setAttribute('value', obj.colors[i]);
        pulldown.value = obj.colors[i];
        pulldown.innerHTML = obj.colors[i]; 
        prodColors.appendChild(pulldown);
        prodColors.addEventListener('change', updateColor);
    }
}    


function updateQuantity(event) {
    console.log(event.target, event.target.value)
    prodObject.quantity = event.target.value;
    console.log(prodObject)
}


function updateColor(event) {
    console.log(event.target, event.target.value)
    prodObject.color = event.target.value;
    console.log(prodObject)
}


function initProdObject(object) {
    prodObject._id = object._id;
    prodObject.name = object.name;
    prodObject.imageUrl = object.imageUrl;
    prodObject.altTxt = object.altTxt;
}

// add to cart event andfunction
function addToCart(event) {
    let pushToCart = true; 
    
  
    console.log(cartArray);
    if (cartArray.length > 0) { 
      
        for (let i = 0; i < cartArray.length; i++) { 
            if (prodObject.name === cartArray[i].name && 
                prodObject.color === cartArray[i].color) { 
              
                cartArray[i].quantity = cartArray[i].quantity + prodObject.quantity;
             
                pushToCart = false;
                syncCart();
            } 
        }
    }
        
    if (pushToCart) {
        cartArray.push(prodObject);
        syncCart();
    }
}

function syncCart() {
    cartString = JSON.stringify(cartArray); 
    localStorage.setItem('cart', cartString); 
    cartArray = JSON.parse(cartString); 
}




    

