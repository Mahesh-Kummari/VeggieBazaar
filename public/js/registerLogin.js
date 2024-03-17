let registrationImage = document.querySelector(".registration-image");
let registerButton = document.getElementById("registerButton");
let showHidePasswordIcon = document.getElementById("showHidePasswordIcon");
let registerForm = document.getElementById("registerForm");
let fullNameEl = document.getElementById("fullName");
let emailEl = document.getElementById("email");
let passwordEl = document.getElementById("password");
let conformPasswordEl = document.getElementById("conformPassword");
let mobileEl = document.getElementById("mobile");

function onRegistrationImageError(){
    registrationImage.src = "/images/register2.jpg";
};
showHidePasswordIcon.addEventListener("click", ()=>{
    showHidePasswordIcon.classList.toggle("fa-eye-slash");
    showHidePasswordIcon.classList.toggle("fa-eye");
    if (conformPassword.type === "password"){
        conformPassword.type = "text";
    }else{
        conformPassword.type = "password";
    }
});
registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let fullName = fullNameEl.value.trim() ;
    let email = emailEl.value.trim() ;
    let password = passwordEl.value.trim() ;
    let conformPassword = conformPasswordEl.value.trim() ;
    let mobile = mobileEl.value.trim() ;
    console.log(fullName);
    if (password === conformPassword){
        let userObj = {
            fullName : fullName,
            email: email,
            password : password,
            conformPassword : conformPassword,
            mobile : mobile

        };
        checkAndRegisterUser(userObj);
    }else{
        alert("Please enter correct password");
    }
});
function checkAndRegisterUser(userObj){
    console.log(userObj);
    // isUserRegistered(userObj){
        
    // }
    // complete the function----------------------------

};