console.log("Hey it's working, You are in Frontend/index.html file...");

let menuBtn = document.getElementsByClassName("menu-btn")[0];
let headSections = document.getElementsByClassName("ul")[0];
let radio = document.getElementById("radio");
let opProductCard = document.getElementsByClassName("op-product");
let opIconsCard = document.getElementById("opIconsCard");

menuBtn.addEventListener("click", ()=>{
    let imageEl = menuBtn.getElementsByTagName("img")[0];
    if (menuBtn.value == "true"){
        // console.log("inside if");
        menuBtn.value = "false";
        
        imageEl.src = "./resources/menu-2.png";
        headSections.style.display = 'none';
          
    }else{
        // console.log("inside else");
        menuBtn.value = "true";

        imageEl.src = "./resources/close-icon.png";
        headSections.style.display = 'block'; 
    }
    
});

// testimonials starts -------------------------------------->
const testimonialContainer = document.querySelector('.testimonial-container');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function showCard(index) {
  testimonialContainer.style.transform = `translateX(-${index * 340}px)`; // Adjusted for card width and margin
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showCard(currentIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < testimonialCards.length - 1) {
    currentIndex++;
    showCard(currentIndex);
  }
});

// testimonials ends -------------------------------------->
