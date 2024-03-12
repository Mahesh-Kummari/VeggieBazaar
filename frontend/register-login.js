console.log("You are in register-login page");
let registrationImage = document.querySelector(".registration-image");
let registerButton = document.getElementById("registerButton");
let showHidePasswordIcon = document.getElementById("showHidePasswordIcon");

function onRegistrationImageError(){
    registrationImage.src = "./resources/register2.jpg";
};
registerButton.addEventListener("click", (e)=>{
    e.preventDefault();
});
showHidePasswordIcon.addEventListener("click", ()=>{
    
})
