// Sign up ///////////////////////////////////////
const signUpForm = document.querySelector("#sign_up form");
signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = signUpForm.querySelector('input[name="username"]').value;
    const password = signUpForm.querySelector('input[name="password"]').value;
    const email = signUpForm.querySelector('input[name="email"]').value;
    const credit_card = signUpForm.querySelector('input[name="credit_card"]').value;

    if (!validateEmail(email)) {
        alert("Please enter a valid email . \n It should end with @gmail.com");
        return;
    }
    if (!validatePassword(password)) {
        alert("Password should contains at least 8 alphanumeric characters . \n It must be a mixture of characters and numbers .");
        return;
    }
    if (!validateCreditCard(credit_card)) {
        alert("Please enter a valid card number .");
        return;
    }
    const userData = {
        name,
        password,
        email,
        credit_card,
        isActive: true,
        role: "user"
    }
    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            alert("failed to sign up . please try again");
            return;
        }
        alert("signed up successfully. now you can sign in");
        return;
    } catch (error) {
        console.error(error);
    }
})

function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password)
}
function validateCreditCard(cardNumber) {
    const regex = /^\d{16}$/;
    return regex.test(cardNumber);
}

// Sign in ///////////////////////////////////////
const signInForm = document.querySelector("#sign_in form");
signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signInForm.querySelector('input[name="email"]').value;
    const password = signInForm.querySelector('input[name="password"]').value;
    const userData = {
        email,
        password
    };
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            alert("invalid email or password . please try again");
            return;
        }
        const data = await response.json();
        if (data.user.isActive === false) {
            alert("This account has been deactivated by the admin.");
            return;
        }
        console.log(data);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);
        if (data.user.role == 'user') {
            window.location.href = "./index.html";
        } else if (data.user.role == 'admin') {
            window.location.href = "../pages/administration.html";
        }
    } catch (error) {
        console.error(error);
    }

})


// Login as anonymous user////////////////////////
const anonymous_login = document.querySelector("#anonymous");
anonymous_login.addEventListener("click", (e) => {
    localStorage.clear();
    localStorage.setItem('userRole', 'anonymous');
    window.location.href = 'index.html';
})
