let menuBtn = document.getElementById("menu-icon");
let menu = document.querySelector('.ul');

menuBtn.addEventListener("click", ()=>{
  menuBtn.classList.toggle("fa-bars")
  menuBtn.classList.toggle("fa-xmark")
  menu.classList.toggle("d-block");
  

  
});

const scrollContainer  = document.querySelector('.testimonial-container');
const prevButton  = document.querySelector('.prev-btn');
const nextButton  = document.querySelector('.next-btn');


prevButton.addEventListener('click', function() {
  scrollContainer.scrollBy({
    left: -scrollContainer.offsetWidth,
    behavior: 'smooth'
  });
});

nextButton.addEventListener('click', function() {
  scrollContainer.scrollBy({
    left: scrollContainer.offsetWidth,
    behavior: 'smooth'
  });
});

scrollContainer.addEventListener('scroll', function() {
  if (scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth) {
    // Load more content or loop back to the beginning
    // Here, I'm just resetting the scroll position to the beginning for demonstration
    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
  }
});
