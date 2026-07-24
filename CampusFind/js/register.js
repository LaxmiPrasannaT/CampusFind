const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("name").value;
const roll = document.getElementById("roll").value;
const department = document.getElementById("department").value;
const phone = document.getElementById("phone").value;

/* validation */

if(name.trim().length < 3){
alert("Enter valid name");
return;
}

const rollPattern = /^[0-9]{2}6B[15]A(01|02|03|04|05|73)[A-Z0-9]{2}$/;

if(!rollPattern.test(roll)){
alert("Enter valid college roll number ");
return;
}
if(!/^[6-9][0-9]{9}$/.test(phone)){
alert("Enter a valid Indian mobile number");
return;
}

const { data } = await supabaseClient
.from("users")
.select("*")
.eq("roll_number",roll);

if(data.length > 0){

    alert("You are already registered. Please use login.");

    showLogin(); // switch to login form

    return;
}


/* insert user */

await supabaseClient.from("users").insert({
name: name,
roll_number: roll,
department: department,
phone: phone,
created_at: new Date()
});

alert("Registration successful!"); 
localStorage.setItem("registeredUser", roll);
window.location.href = "index.html";
form.reset();

});
// LOGIN LOGIC 

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const roll = document.getElementById("loginRoll").value;
    const phone = document.getElementById("loginPhone").value;

    const { data } = await supabaseClient
        .from("users")
        .select("*")
        .eq("roll_number", roll)
        .single();

    if(!data){
        alert("User not found. Please register.");
        return;
    }

    if(data.phone !== phone){
        alert("Invalid phone number.");
        return;
    }

    localStorage.setItem("registeredUser", roll);

    alert("Login successful!");
    window.location.href = "index.html";
});
function showRegister(){
    document.getElementById("registerForm").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";

    // button colors
    document.getElementById("registerBtn").classList.add("active");
    document.getElementById("loginBtn").classList.remove("active");
}

function showLogin(){
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "flex";

    // button colors
    document.getElementById("loginBtn").classList.add("active");
    document.getElementById("registerBtn").classList.remove("active");
}