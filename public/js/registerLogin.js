let registrationImage = document.querySelector(".registration-image");
let registerButton = document.getElementById("registerButton");
let showHidePasswordIconLogin = document.getElementById("showHidePasswordIconLogin");
let showHidePasswordIconRegister = document.getElementById("showHidePasswordIconRegister");
let registerForm = document.getElementById("registerForm");
let fullNameEl = document.getElementById("fullName");
let emailEl = document.getElementById("email");
let loginEmailEl = document.getElementById("loginEmail");
let passwordEl = document.getElementById("password");
let loginPasswordEl = document.getElementById("loginPassword");
let conformPasswordRegisterEl = document.getElementById("conformPasswordRegister");
let mobileEl = document.getElementById("mobile");

function onRegistrationImageError(){
    registrationImage.src = "/images/register2.jpg";
};
showHidePasswordIconRegister.addEventListener("click", ()=>{
    showHidePasswordIconRegister.classList.toggle("fa-eye-slash");
    showHidePasswordIconRegister.classList.toggle("fa-eye");
    if (conformPasswordRegisterEl.type === "password"){
        conformPasswordRegisterEl.type = "text";
    }else{
        conformPasswordRegisterEl.type = "password";
    }
});
showHidePasswordIconLogin.addEventListener("click", ()=>{
    showHidePasswordIconLogin.classList.toggle("fa-eye-slash");
    showHidePasswordIconLogin.classList.toggle("fa-eye");
    if (loginPasswordEl.type === "password"){

        loginPasswordEl.type = "text";
    }else{
        loginPasswordEl.type = "password";
    }
});
registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let fullName = fullNameEl.value.trim() ;
    let email = emailEl.value.trim() ;
    let password = passwordEl.value.trim() ;
    let conformPassword = conformPasswordRegisterEl.value.trim() ;
    let mobile = mobileEl.value.trim() ;
    console.log(fullName);
    if (password === conformPassword){
        let userObj = {
            fullName : fullName,
            email: email,
            password : password,
            mobile : mobile
        };
        checkAndRegisterUser(userObj);
    }else{
        alert("Please enter correct password");
    }
});

function checkAndRegisterUser(userObj){
    let url = http://localhost:3000/addUser;
}