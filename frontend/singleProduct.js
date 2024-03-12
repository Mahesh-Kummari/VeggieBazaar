let decrementBtn = document.querySelector(".decrementBtn");
let incrementBtn = document.querySelector(".incrementBtn");
let countEl = document.querySelector(".count");
let starsIconCard = document.querySelector(".stars-icon-card");

let singleProductSection = document.querySelector(".single-product-section");
let productImage = document.querySelector(".product-image");
let productName = document.querySelector(".product-name");
let actualPrice = document.querySelector(".actual-price");
let price = document.querySelector(".price");
let description = document.querySelector(".description");


decrementBtn.addEventListener("click", ()=>{
    let count = Number(countEl.value);
    if(count > 1){
        count -= 1;
        countEl.value = count ;
    };
});
incrementBtn.addEventListener("click", ()=>{
    let count = Number(countEl.value);
    count += 1;
    countEl.value = count ;
});

function displayRatingStars(){
    let rating = document.querySelector(".rating").textContent;
    if (!isNaN(rating)){
        let ratingArr = rating.split(".");
        let integer = Number(ratingArr[0])
        let decimal = Number(ratingArr[1])

        for (let i=0; i< integer; i++){
            let icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-star");
            starsIconCard.appendChild(icon)
        }
        if (decimal !== 0){
            let icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-star-half-stroke");
            starsIconCard.appendChild(icon);
        }
    }
    else{
        console.log("Not a num");
    }
};
displayRatingStars()

// Function to get query parameter value by name from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const productId = getQueryParam('id');

fetch('http://localhost:3000/getProducts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    if (productId > 0 && productId < 100){
        getProduct(productId, data.vegetables)
    }
    else if (productId > 100 && productId < 200){
        getProduct(productId, data.fruits)
    }
    else if (productId > 200 && productId < 300){
        getProduct(productId, data.juices)
    }
    else if (productId > 300 && productId < 400){
        getProduct(productId, data.cereals)
    } 
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  })
function getProduct(productId, productsArr){
    for (let product of productsArr){
        if (product.id == productId){
            displaySingleItem(product);
            break;
        }
    }
}
function displaySingleItem(product){
    singleProductSection.id = product.id;
    productName.textContent = product.name;
    actualPrice.textContent = product.discounted_price;
    price.textContent = product.price;
    description.textContent = product.description;
    productImage.src = product.image;
    productImage.onerror = () =>{
        productImage.src = "./resources/fruits-and-vegetables-boxes.jpg";
    }
}



