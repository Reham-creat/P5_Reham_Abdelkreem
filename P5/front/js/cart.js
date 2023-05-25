
let productLocalStorage = JSON.parse(localStorage.getItem('cart'));

function syncCart() {
    let cartString = JSON.stringify(productLocalStorage); 
    localStorage.setItem('cart', cartString); 
    productLocalStorage = JSON.parse(cartString); 
}


const priceObject = {};
fetch('http://localhost:3000/api/products/')
    .then(response => response.json()) 
    .then(data => initPrices(data))
    .then(() => {
        buildPage();
        getTotals();
    })
    .catch(error => console.log(error));


function initPrices(array) {
    const length = array.length;
    for (let i=0; i < length; i++) {
      
        priceObject[array[i]._id] = array[i].price;
    }
    console.log(priceObject);
}

function buildPage() {
   
    if (!productLocalStorage) { 
        cart = [];
    } else {
        
        for (let i=0; i < productLocalStorage.length; i++) {

           
            let productArticle = document.createElement('article');
            productArticle.classList.add('cart__item');
            productArticle.setAttribute('data-id', productLocalStorage[i]._id);
            productArticle.setAttribute('data-color', productLocalStorage[i].color);
            document.querySelector('#cart__items').appendChild(productArticle);

         
            let productDivImage = document.createElement('div');
            productDivImage.classList.add('cart__item__img');
            productArticle.appendChild(productDivImage);
            
           
            let productImage = document.createElement('img');
            productImage.src = productLocalStorage[i].imageUrl;
            productImage.alt = productLocalStorage[i].altTxt;
            productDivImage.appendChild(productImage);
            
           
            let productItemContent = document.createElement('div');
            productItemContent.classList.add('cart__item__content');
            productArticle.appendChild(productItemContent);
        
           
            let productItemContentDescription = document.createElement('div');
            productItemContentDescription.classList.add('cart__item__content__description');
            productItemContent.appendChild(productItemContentDescription);
            
            let productName = document.createElement('h2');
            productName.innerHTML = productLocalStorage[i].name;
            productItemContentDescription.appendChild(productName);

            
            let productColor = document.createElement('p');
            productColor.innerHTML = productLocalStorage[i].color;
            productItemContentDescription.appendChild(productColor);
            
           
            let productPrice = document.createElement('p');
          
            productPrice.innerHTML = ' €' + priceObject[productLocalStorage[i]._id]; 
            productItemContentDescription.appendChild(productPrice);

        
            let productItemContentSettings = document.createElement('div');
            productItemContentSettings.classList.add('cart__item__content__settings');
            productItemContent.appendChild(productItemContentSettings);
           
            let productItemContentQuantity = document.createElement('div');
            productItemContentQuantity.classList.add('cart__item__content__settings__quantity');
            productItemContentSettings.appendChild(productItemContentQuantity);
        
            let productQuantityText = document.createElement('p');
            productQuantityText.innerHTML = 'Qté : ';
            productItemContentQuantity.appendChild(productQuantityText);
            // add quantity
            let productQuantity = document.createElement('input');
            productQuantity.value = productLocalStorage[i].quantity;
            productQuantity.className = 'itemQuantity';
            productQuantity.setAttribute('type', 'number');
            productQuantity.setAttribute('min', '1');
            productQuantity.setAttribute('max', '100');
            productQuantity.setAttribute('name', 'itemQuantity');
            productItemContentQuantity.appendChild(productQuantity);
            productQuantity.addEventListener('click', updateQuantity); 

          
            let productDeleteItem = document.createElement('div');
            productDeleteItem.classList.add('cart__item__content__settings__delete');
            productItemContentSettings.appendChild(productDeleteItem);

           
            let productDelete = document.createElement('p');
            productDelete.className = 'deleteItem';
            productDelete.innerHTML = 'Delete';
            productDeleteItem.appendChild(productDelete);
            // delete button even listener
            productDelete.addEventListener('click', deleteItem);
        }
      
       
        const orderBtn = document.getElementById('order');
        orderBtn.addEventListener('click', orderItem);
    }
}


function deleteItem(event){
   
    console.log(event);
    const deleteBtn = event.target;
    const productCard = deleteBtn.parentElement.parentElement.parentElement.parentElement; 
    const productId = productCard.dataset.id;
    const productColor = productCard.dataset.color 
    productCard.remove();


    for (let i = productLocalStorage.length - 1; i >= 0; i--) {
        if (productId === productLocalStorage[i]._id && productColor === productLocalStorage[i].color) {
           productLocalStorage.splice(i, 1);
        }
    }
   
    getTotals();
  
    syncCart();
}

function updateQuantity(e){
    console.log(e.target);
    const productCard = e.target.parentElement.parentElement.parentElement.parentElement; // traversing the DOM to the article
    console.log(productCard);
    let quantityInput = 0;
    let productQuantity = document.createElement('input');
    const productId = productCard.dataset.id; // grab the data-id
    const productColor = productCard.dataset.color // grab the data-color

    for (let i=0; i < productLocalStorage.length; i++) {
        if (productId === productLocalStorage[i]._id && productColor === productLocalStorage[i].color) {
            quantityInput += e.target.valueAsNumber;
            productLocalStorage[i].quantity = quantityInput;
        }
    }
   
    getTotals();
  
    syncCart();
}

function getTotals(){
 
    let productQte = document.getElementsByClassName('itemQuantity');
    let myLength = productQte.length;
    let totalQte = 0;

    for (let i=0; i < myLength; i++) {
        totalQte += productQte[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQte;

    // total price    
    let totalPrice = 0; 
        for (let i = 0; i < myLength; i++) { 
            totalPrice += (productQte[i].valueAsNumber * priceObject[productLocalStorage[i]._id]); // get price from object
        } 
    
    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;     
    syncCart();
}


let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; 
let charAlphaRegExp = /^[A-Za-z -]{3,32}$/;
let addressRegExp = /^[A-Za-z0-9 ]{7,32}$/; 


let form = document.querySelector('.cart__order__form');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

let validFirstName = false;
let validLastName = false;
let validAddress = false;
let validCity = false;
let validEmail = false;

    firstName.addEventListener('change', checkFirstName);
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    function checkFirstName() {
        if (charAlphaRegExp.test(firstName.value)) {
            firstNameErrorMsg.innerHTML = null;
            firstName.style.border = '2px solid green';
            validFirstName = true;
        } else if (charAlphaRegExp.test(firstName.value) === false||firstName.value === '') {
            firstNameErrorMsg.innerHTML = 'Please enter a valid first name';
            firstName.style.border = '2px solid red';
            validFirstName = false;
        }
    };

 
    lastName.addEventListener('change', checkLastName);
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    function checkLastName() {
        if (charAlphaRegExp.test(lastName.value)) {
            lastNameErrorMsg.innerHTML = null;
            lastName.style.border = '2px solid green';
            validLastName = true;
        } else if (charAlphaRegExp.test(lastName.value) === false||lastName.value === ''){
            lastNameErrorMsg.innerHTML = 'Please enter a valid last name';;
            lastName.style.border = '2px solid red';
            validLastName = false;
        }
    };

   
    address.addEventListener('change', checkAddress);
    let addressErrorMsg = document.getElementById('addressErrorMsg');
    function checkAddress() {
        if (addressRegExp.test(address.value)) {
            addressErrorMsg.innerHTML = null;
            address.style.border = '2px solid green';
            validAddress = true;
        } else if (addressRegExp.test(address.value) === false||address.value === ''){
            addressErrorMsg.innerHTML = 'Please enter a valid address';
            address.style.border = '2px solid red';
            validAddress = false;
        }
    };

    city.addEventListener('change', checkCity);
    let cityErrorMsg = document.getElementById('cityErrorMsg');
    function checkCity() {
        if (charAlphaRegExp.test(city.value)) {
            cityErrorMsg.innerHTML = null;
            city.style.border = '2px solid green';
            validCity = true;
        } else if (charAlphaRegExp.test(city.value) === false||city.value === ''){
            cityErrorMsg.innerHTML = 'Please enter a valid city'
            city.style.border = '2px solid red';
            validCity = false;
        }
    }; 

   
    email.addEventListener('change', checkEmail);
    let emailErrorMsg = document.getElementById('emailErrorMsg');
    function checkEmail() {
        if (emailRegExp.test(email.value)) {
            emailErrorMsg.innerHTML = null;
            email.style.border = '2px solid green';
           validEmail = true;
        } else if (emailRegExp.test(email.value) === false||email.value === '') {
            emailErrorMsg.innerHTML = 'Please enter a valid email address';
            email.style.border = '2px solid red';
            validEmail = false;
        }
    }; 


function orderItem(event){
    event.preventDefault();

    let contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
    }

    const products = [];
    for (let i = 0; i < productLocalStorage.length; i++) {
        products.push(productLocalStorage[i]._id);
    }
    

    const formData = {
        contact,
        products,
    }

    const orderData = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json',
        }
    };    

   
    if (validFirstName === true && validLastName === true && validAddress === true && validCity === true && validEmail === true ){
        fetch('http://localhost:3000/api/products/order', orderData)
        .then(response => response.json())
        .then((data) => {
            let confirmationUrl = './confirmation.html?id=' + data.orderId;
            localStorage.clear();
            window.location.href = confirmationUrl;
        })
        .catch(error => console.log(error));
    } else {
        alert('Please properly fill out the form');
    }
}


    






    
