/* =========================================
   AUTH PAGE — LOGIN / SIGN UP
========================================= */


/* =========================================
   FLOATING PARTICLES (same as home page)
========================================= */

const particlesContainer = document.getElementById("particles");

if (particlesContainer) {

    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("div");
        particle.classList.add("particle");

        particle.style.left = Math.random() * 100 + "%";

        particle.style.setProperty(
            "--duration",
            (6 + Math.random() * 10) + "s"
        );

        particle.style.animationDelay = (-Math.random() * 10) + "s";

        const size = 1 + Math.random() * 2;
        particle.style.width = size + "px";
        particle.style.height = size + "px";

        particlesContainer.appendChild(particle);

    }

}


/* =========================================
   TAB SWITCHING — LOGIN / SIGN UP
========================================= */

const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const authTabs = document.querySelector(".auth-tabs");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function showLogin() {

    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    authTabs.classList.remove("signup-active");

    signupForm.classList.remove("active");
    loginForm.classList.remove("active");

    // restart the reveal animation
    void loginForm.offsetWidth;
    loginForm.classList.add("active");

}

function showSignup() {

    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    authTabs.classList.add("signup-active");

    loginForm.classList.remove("active");
    signupForm.classList.remove("active");

    void signupForm.offsetWidth;
    signupForm.classList.add("active");

}

if (tabLogin && tabSignup) {

    tabLogin.addEventListener("click", showLogin);
    tabSignup.addEventListener("click", showSignup);

    document.querySelectorAll(".switchToSignup").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            showSignup();
        });
    });

    document.querySelectorAll(".switchToLogin").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            showLogin();
        });
    });

}


/* =========================================
   ROLE TOGGLE — CREATOR / BRAND
========================================= */

const roleButtons = document.querySelectorAll(".auth-role-btn");

roleButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

        roleButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

    });

});


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

document.querySelectorAll(".auth-eye").forEach((btn) => {

    btn.addEventListener("click", () => {

        const input = btn.parentElement.querySelector("input");
        const icon = btn.querySelector("i ,svg");

        if (!input) return;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }

    });

});


/* =========================================
   FORM SUBMIT (demo — no backend wired yet)
========================================= */

/* =========================================
   FORM SUBMIT — REAL BACKEND CONNECTION
========================================= */

const API_URL = "https://nexcollabweb-backend.onrender.com/api/auth";
// ===== SIGNUP FORM =====
if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const btn = signupForm.querySelector(".auth-submit");
        const original = btn.innerHTML;

        const name = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = document.getElementById("signupPassword").value;
        const role = document.querySelector(".auth-role-btn.active").dataset.role;

        btn.innerHTML = "Please wait...";
        btn.style.opacity = "0.75";

        try {

            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                showLogin();
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Server se connect nahi ho paya. Backend chal raha hai check karo.");
        }

        btn.innerHTML = original;
        btn.style.opacity = "1";

    });

}

// ===== LOGIN FORM =====
if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const btn = loginForm.querySelector(".auth-submit");
        const original = btn.innerHTML;

        const email = loginForm.querySelector('input[type="email"]').value;const password = document.getElementById("loginPassword").value;
        

        btn.innerHTML = "Please wait...";
        btn.style.opacity = "0.75";

        try {

            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                alert(data.message);
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Server se connect nahi ho paya. Backend chal raha hai check karo.");
        }

        btn.innerHTML = original;
        btn.style.opacity = "1";

    });

}
