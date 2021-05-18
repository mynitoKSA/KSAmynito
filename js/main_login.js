const adminBtn = document.getElementById("admin")
const loginBtn = document.getElementById("login")
const signupBtn = document.getElementById("admin")

const loginForm = document.getElementById("login-form")

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = loginForm.name.value;
    const stNum = loginForm.stNum.value;
    const pw = loginForm.password.value;

    alert(stNum + " " + name + " " + pw)
})