console.log("Hey it's working, You are in Frontend/index.html file...");

let menuBtn = document.getElementsByClassName("menu-btn")[0];
let headSections = document.getElementsByClassName("ul")[0];
let radio = document.getElementById("radio");

console.log(menuBtn, headSections);
menuBtn.addEventListener("click", ()=>{
    let imageEl = menuBtn.getElementsByTagName("img")[0];
    if (menuBtn.value == "true"){
        console.log("inside if");
        menuBtn.value = "false";
        
        imageEl.src = "./resources/menu-2.png";
        headSections.style.display = 'none';
          
    }else{
        console.log("inside else");
        menuBtn.value = "true";

        imageEl.src = "./resources/close-icon.png";
        headSections.style.display = 'block'; 
    }
    
});