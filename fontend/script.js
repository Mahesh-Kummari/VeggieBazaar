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

// const testimonialContainer = document.querySelector('.testimonials-container');

// // Clone testimonials to create infinite scrolling effect
// testimonialContainer.innerHTML += testimonialContainer.innerHTML;

// // Scroll testimonials horizontally
// function scrollTestimonials() {
//   if (testimonialContainer.scrollLeft >= testimonialContainer.scrollWidth / 2) {
//     testimonialContainer.scrollLeft = 0;
//   } else {
//     testimonialContainer.scrollLeft += 2; // Adjust scroll speed if needed
//   }
// }

// // Auto-scroll every 50 milliseconds
// setInterval(scrollTestimonials, 0);

// testimonials ends -------------------------------------->
const testimonialContainer = document.querySelector('.testimonial-container');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;
const testimonialWidth = testimonials[0].offsetWidth;

function showTestimonial(index) {
  testimonialContainer.scrollLeft = index * testimonialWidth;
}

prevBtn.addEventListener('click', () => {
  currentIndex = Math.max(currentIndex - 1, 0);
  showTestimonial(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = Math.min(currentIndex + 1, totalTestimonials - 1);
  showTestimonial(currentIndex);
});
