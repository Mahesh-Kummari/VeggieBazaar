let decrementBtn = document.querySelector(".decrementBtn");
let incrementBtn = document.querySelector(".incrementBtn");
let countEl = document.querySelector(".count");
let starsIconCard = document.querySelector(".stars-icon-card");
let arrowUp = document.getElementById("arrowBtn");

let currentPath = window.location.pathname;
let pathSegments = currentPath.split('/');
let myProductId = parseInt(pathSegments[pathSegments.length - 1]);

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
window.addEventListener("scroll", function(){
    arrowUp.style.opacity = (window.scrollY > 20) ? 1 : 0;
  });
arrowUp.addEventListener("click", function(){
    window.scrollTo({
        top:0,
        behavior : "smooth"
    });
});

const getSingleProductDetails = ()=>{
    let url = '/getSingleProductDetails/' + myProductId;
    fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok');
        };
        return response.json();
    })
    .then(data => {
        displaySingleItem(data);
    })
    .catch(error => {
        if (error instanceof SyntaxError) {
            console.log('Response is not a valid JSON');
        } else {
            console.error(`Error in fetching single product details: ${error.message}`);
        }
    });
}
getSingleProductDetails();
function displaySingleItem(product){
    singleProductSection.id = product.id;
    productName.textContent = product.name;
    actualPrice.textContent = "₹ "+ product.discounted_price;
    price.textContent = "₹ "+ product.price ;
    description.textContent = product.description;
    let image_url = product.image.substring(2)
    productImage.src = image_url;
    console.log(product.image);
    console.log(image_url);
    productImage.onerror = () =>{
        productImage.src = "/images/product-default-image.jpeg";
    }
}

