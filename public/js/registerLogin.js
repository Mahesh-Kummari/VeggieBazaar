

let registrationImage = document.querySelector(".registration-image");
let registerButton = document.getElementById("registerButton");
let showHidePasswordIconLogin = document.getElementById("showHidePasswordIconLogin");
let showHidePasswordIconRegister = document.getElementById("showHidePasswordIconRegister");
let registerForm = document.getElementById("registerForm");
let loginForm = document.getElementById("loginForm");
let fullNameEl = document.getElementById("fullName");
let emailEl = document.getElementById("email");
let loginEmailEl = document.getElementById("loginEmail");
let passwordEl = document.getElementById("password");
let loginPasswordEl = document.getElementById("loginPassword");
let conformPasswordRegisterEl = document.getElementById("conformPasswordRegister");
let mobileEl = document.getElementById("mobile");


function showMessage(message, messageType) {
	const messageContainer = document.getElementById("messageContainer");
	const messageElement = document.createElement("div");
	messageElement.className = `message ${messageType}`;
	messageElement.textContent = message;
	messageContainer.appendChild(messageElement);

    setTimeout(() => {
			messageElement.remove();
	}, 15000);
}

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
    let mobile = mobileEl.value.trim() ;
    if (password === conformPassword){
        let userObj = {
            full_name : fullName,
            email: email,
            password : password,
            mobile : mobile
        };
        checkAndRegisterUser(userObj);
    }else{
        alert("Please enter correct password");
    }
});

async function checkAndRegisterUser(data){
    let url = 'http://localhost:3000/addUser'
    let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		};
        let responseData = await httpRequest(url,options);
        if (responseData) {
            showMessage(`${responseData.message}`, "success");
		}
       
}



const httpRequest = async (url, options) => {
    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            let error = await response.json()
            throw new Error(`${error.message}`);
        }
        let data = await response.json();
        // console.log("http:",data)
        return data
    } catch (error) {
        showMessage(`${error.message}`, "error")
    }
	
};


loginForm.addEventListener('submit',(event)=>{
	event.preventDefault();
	let email = loginEmailEl.value.trim();
	let password = loginPasswordEl.value.trim();
    let payload = {
        email:email,
        password:password
    }
    login(payload);
})

async function login(data){
   let url = "http://localhost:3000/login";
   let options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		};
        let responseData = await httpRequest(url,options);
        console.log(responseData.token);
        if (responseData.token) {
            localStorage.setItem("token", responseData.token);
            showMessage(`${responseData.message}`, "success");
		}
}