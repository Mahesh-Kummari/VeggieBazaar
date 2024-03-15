let menuBtn = document.getElementById("menu-icon");
let menu = document.querySelector('.ul');
let vegetablesContainer = document.getElementById("vegetablesContainer");
let fruitsContainer = document.getElementById("fruitsContainer");
let juicesContainer = document.getElementById("juicesContainer");
let cerealsContainer = document.getElementById("cerealsContainer");

let MAX_VEG_CARDS_TO_DISPLAY = 8;
let MAX_FRUIT_CARDS_TO_DISPLAY = 8;
let MAX_JUICE_CARDS_TO_DISPLAY = 8;
let MAX_CEREAL_CARDS_TO_DISPLAY = 8;

fetch('http://localhost:3000/getProducts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    displayVegetables(data.vegetables) 
    displayFruits(data.fruits) 
    displayJuices(data.juices) 
    displayCereals(data.cereals) 
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  })


menuBtn.addEventListener("click", ()=>{
  menuBtn.classList.toggle("fa-bars")
  menuBtn.classList.toggle("fa-xmark")
  menu.classList.toggle("d-block");
});
//scroll
const categoryCards = document.querySelectorAll(".c-inner");

categoryCards.forEach((card) => {
    card.addEventListener("click", (event) => {
        const targetContainerId = event.currentTarget.dataset.target;
        const targetContainer = document.getElementById(targetContainerId);
        if (targetContainer) {
            targetContainer.scrollIntoView({ behavior: "smooth" });
        }
    });
});


function displayVegetables(vegetablesArray){
  for (let i = 0; i < vegetablesArray.length && i < MAX_VEG_CARDS_TO_DISPLAY; i++) {
    createCard(vegetablesArray[i], vegetablesContainer);
  }
  if (vegetablesArray.length > MAX_VEG_CARDS_TO_DISPLAY) {
    addShowMoreButton(vegetablesContainer, vegetablesArray);
  }
};
function displayFruits(fruitsArray){
  for (let i = 0; i < fruitsArray.length && i < MAX_FRUIT_CARDS_TO_DISPLAY; i++) {
    createCard(fruitsArray[i], fruitsContainer);
  }
  if (fruitsArray.length > MAX_FRUIT_CARDS_TO_DISPLAY) {
    addShowMoreButton(fruitsContainer, fruitsArray);
  }
};
function displayJuices(juicesArray){
  for (let i = 0; i < juicesArray.length && i < MAX_JUICE_CARDS_TO_DISPLAY; i++) {
    createCard(juicesArray[i], juicesContainer);
  }
  if (juicesArray.length > MAX_JUICE_CARDS_TO_DISPLAY) {
    addShowMoreButton(juicesContainer, juicesArray);
  }
};
function displayCereals(cerealsArray) {
  for (let i = 0; i < cerealsArray.length && i < MAX_CEREAL_CARDS_TO_DISPLAY; i++) {
    createCard(cerealsArray[i], cerealsContainer);
  }
  if (cerealsArray.length > MAX_CEREAL_CARDS_TO_DISPLAY) {
    addShowMoreButton(cerealsContainer, cerealsArray);
  }
};
function addShowMoreButton(parentContainer, productsArr) {
  let showMoreButton;

  function appendShowMoreButton() {
    showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.classList.add("products-show-more-btn");

    showMoreButton.addEventListener("click", () => {
      parentContainer.removeChild(showMoreButton);

      const startIdx = parentContainer.children.length - 1;
      const endIdx = startIdx + 8;
      for (let i = startIdx + 1; i <= endIdx && i < productsArr.length; i++) {
        createCard(productsArr[i], parentContainer);
      }
      appendShowMoreButton(); // Re-append the button after displaying more products
      if (endIdx >= productsArr.length - 1) {
        showMoreButton.style.display = "none";
      }
    });
    parentContainer.appendChild(showMoreButton);
  }

  appendShowMoreButton();
};
function createCard(item, parentContainer){
  let div = document.createElement("div");
  div.classList.add("op-product");
  div.id = item.id;
  parentContainer.appendChild(div)

  let image = document.createElement("img");
  image.classList.add("op-product-image");
  image.setAttribute("loading", "lazy")
  image.src = item.image;
  image.alt = item.name;
  image.onerror = function(){
    image.src = "../images/spinach.jpg"
  }
  div.appendChild(image);

  let nameEl = document.createElement("p");
  nameEl.classList.add("op-product-name");
  nameEl.textContent = item.name;
  div.appendChild(nameEl);

  let priceEl = document.createElement("p");
  priceEl.classList.add("op-product-price");
  priceEl.textContent = "₹ " + item.discounted_price;
  div.appendChild(priceEl);

  let actualPriceEl = document.createElement("span");
  actualPriceEl.classList.add("op-product-price");
  actualPriceEl.textContent = "₹ " + item.price;
  priceEl.appendChild(actualPriceEl);
  
  let iconsBgCard = document.createElement("div");
  iconsBgCard.classList.add("icons-bg-card");
  div.appendChild(iconsBgCard);

  let iconsCard = document.createElement("div");
  iconsCard.classList.add("op-icons-card");
  iconsBgCard.appendChild(iconsCard);

  let iconEl1 = document.createElement("p");
  iconEl1.classList.add("op-icon");
  iconsCard.appendChild(iconEl1);

  let icon1 = document.createElement("i");
  icon1.classList.add("fa-solid", "fa-bars");
  iconEl1.appendChild(icon1)

  let iconEl2 = document.createElement("p");
  iconEl2.classList.add("op-icon");
  iconsCard.appendChild(iconEl2);

  let icon2 = document.createElement("i");
  icon2.classList.add("fa-solid", "fa-cart-arrow-down");
  iconEl2.appendChild(icon2)

  let iconEl3 = document.createElement("p");
  iconEl3.classList.add("op-icon");
  iconsCard.appendChild(iconEl3);

  let icon3 = document.createElement("i");
  icon3.classList.add("fa-solid", "fa-heart");
  iconEl3.appendChild(icon3)
};

function handleProductContainerClick(event, containerId) {
  if (event.target.id !== containerId) {
      const id = event.target.closest(".op-product").id;
      if (id !== undefined) {
          navigateToSingleProductPage(id);
      }
  }
}
vegetablesContainer.addEventListener("click", (event) => {
  handleProductContainerClick(event, "vegetablesContainer");
});
fruitsContainer.addEventListener("click", (event) => {
  handleProductContainerClick(event, "fruitsContainer");
});
juicesContainer.addEventListener("click", (event) => {
  handleProductContainerClick(event, "juicesContainer");
});
cerealsContainer.addEventListener("click", (event) => {
  handleProductContainerClick(event, "cerealsContainer");
});
function navigateToSingleProductPage(productId) {
  // Construct the URL of the single product page with the product ID as a query parameter
  const singleProductPageUrl = `showSingleProductPage?id=${productId}`;

  // Navigate to the single product page
  window.location.href = singleProductPageUrl;
}

