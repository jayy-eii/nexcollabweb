/* =========================================
   PROFILE PAGE
========================================= */

const PROFILE_API = "http://localhost:3000/api/profile";


/* =========================================
   FLOATING PARTICLES
========================================= */

const particlesContainer = document.getElementById("particles");

if (particlesContainer) {

    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("div");
        particle.classList.add("particle");

        particle.style.left = Math.random() * 100 + "%";
        particle.style.setProperty("--duration", (6 + Math.random() * 10) + "s");
        particle.style.animationDelay = (-Math.random() * 10) + "s";

        const size = 1 + Math.random() * 2;
        particle.style.width = size + "px";
        particle.style.height = size + "px";

        particlesContainer.appendChild(particle);

    }

}


/* =========================================
   NAVBAR LOGIN STATE
========================================= */

const navAuthButtons = document.getElementById("navAuthButtons");
const navUserMenu = document.getElementById("navUserMenu");
const navUserName = document.getElementById("navUserName");
const navUserAvatar = document.getElementById("navUserAvatar");
const navLogoutBtn = document.getElementById("navLogoutBtn");

const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user") || "null");

if (storedUser && navAuthButtons && navUserMenu) {
    navAuthButtons.style.display = "none";
    navUserMenu.style.display = "flex";
    navUserName.textContent = storedUser.name;
    navUserAvatar.textContent = storedUser.name.charAt(0).toUpperCase();
}

if (navLogoutBtn) {
    navLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "auth.html";
    });
}


/* =========================================
   PAGE GUARD — must be logged in
========================================= */

const profileLoading = document.getElementById("profileLoading");
const profileContent = document.getElementById("profileContent");

if (!token) {
    // not logged in — send to auth page
    window.location.href = "auth.html";
}


/* =========================================
   ELEMENTS
========================================= */

const profileForm = document.getElementById("profileForm");
const avatarPreview = document.getElementById("avatarPreview");
const profileHeaderName = document.getElementById("profileHeaderName");
const profileRoleBadge = document.getElementById("profileRoleBadge");

const fieldAvatar = document.getElementById("fieldAvatar");
const fieldBio = document.getElementById("fieldBio");
const bioCount = document.getElementById("bioCount");
const fieldCategory = document.getElementById("fieldCategory");
const fieldFollowers = document.getElementById("fieldFollowers");
const fieldInstagram = document.getElementById("fieldInstagram");
const fieldYoutube = document.getElementById("fieldYoutube");
const fieldTwitter = document.getElementById("fieldTwitter");
const fieldWebsite = document.getElementById("fieldWebsite");

const portfolioList = document.getElementById("portfolioList");
const portfolioPreview = document.getElementById("portfolioPreview");
const addPortfolioBtn = document.getElementById("addPortfolioBtn");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileStatusMsg = document.getElementById("profileStatusMsg");


/* =========================================
   AVATAR PREVIEW
========================================= */

function updateAvatarPreview(url, fallbackLetter) {

    avatarPreview.innerHTML = "";

    if (url) {
        const img = document.createElement("img");
        img.src = url;
        img.onerror = () => { avatarPreview.innerHTML = fallbackLetter || "?"; };
        avatarPreview.appendChild(img);
    } else {
        avatarPreview.textContent = fallbackLetter || "?";
    }

}

if (fieldAvatar) {
    fieldAvatar.addEventListener("input", () => {
        updateAvatarPreview(fieldAvatar.value.trim(), storedUser ? storedUser.name.charAt(0).toUpperCase() : "?");
    });
}


/* =========================================
   BIO CHAR COUNT
========================================= */

if (fieldBio) {
    fieldBio.addEventListener("input", () => {
        bioCount.textContent = fieldBio.value.length;
    });
}


/* =========================================
   PORTFOLIO ROWS
========================================= */

function renderPortfolioPreview() {

    portfolioPreview.innerHTML = "";

    const rows = portfolioList.querySelectorAll(".portfolio-row input");

    rows.forEach((input) => {

        const url = input.value.trim();
        if (!url) return;

        const thumb = document.createElement("div");
        thumb.className = "portfolio-thumb";

        const img = document.createElement("img");
        img.src = url;
        img.onerror = () => thumb.remove();

        thumb.appendChild(img);
        portfolioPreview.appendChild(thumb);

    });

}

function addPortfolioRow(value = "") {

    const row = document.createElement("div");
    row.className = "portfolio-row";

    row.innerHTML = `
        <input type="url" placeholder="https://example.com/your-work.jpg" value="${value ? value.replace(/"/g, "&quot;") : ""}">
        <button type="button" class="portfolio-remove-btn"><i class="fa-solid fa-xmark"></i></button>
    `;

    row.querySelector("input").addEventListener("input", renderPortfolioPreview);

    row.querySelector(".portfolio-remove-btn").addEventListener("click", () => {
        row.remove();
        renderPortfolioPreview();
    });

    portfolioList.appendChild(row);

}

if (addPortfolioBtn) {
    addPortfolioBtn.addEventListener("click", () => addPortfolioRow());
}
/* =========================================
   FILE UPLOAD HELPER (uses backend /api/upload)
========================================= */

const UPLOAD_API = "http://localhost:3000/api/upload";

async function uploadFiles(fileList) {

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    const res = await fetch(UPLOAD_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Upload fail ho gaya");
    }

    return data.urls;

}


/* =========================================
   AVATAR — UPLOAD FROM DEVICE
========================================= */

const fieldAvatarFile = document.getElementById("fieldAvatarFile");
const avatarUploadBtn = document.getElementById("avatarUploadBtn");
const avatarUploadStatus = document.getElementById("avatarUploadStatus");

if (avatarUploadBtn && fieldAvatarFile) {

    avatarUploadBtn.addEventListener("click", () => fieldAvatarFile.click());

    fieldAvatarFile.addEventListener("change", async () => {

        if (!fieldAvatarFile.files.length) return;

        avatarUploadStatus.textContent = "Uploading...";
        avatarUploadStatus.className = "profile-status-msg";

        try {

            const urls = await uploadFiles(fieldAvatarFile.files);
            fieldAvatar.value = urls[0];

            updateAvatarPreview(
                urls[0],
                storedUser ? storedUser.name.charAt(0).toUpperCase() : "?"
            );

            avatarUploadStatus.textContent = "Photo uploaded!";
            avatarUploadStatus.classList.add("success");

        } catch (error) {
            avatarUploadStatus.textContent = error.message;
            avatarUploadStatus.classList.add("error");
        }

        fieldAvatarFile.value = "";

    });

}


/* =========================================
   PORTFOLIO — UPLOAD FROM DEVICE
========================================= */

const portfolioFileInput = document.getElementById("portfolioFileInput");
const uploadPortfolioBtn = document.getElementById("uploadPortfolioBtn");

if (uploadPortfolioBtn && portfolioFileInput) {

    uploadPortfolioBtn.addEventListener("click", () => portfolioFileInput.click());

    portfolioFileInput.addEventListener("change", async () => {

        if (!portfolioFileInput.files.length) return;

        try {

            const urls = await uploadFiles(portfolioFileInput.files);
            urls.forEach((url) => addPortfolioRow(url));
            renderPortfolioPreview();

        } catch (error) {
            alert(error.message);
        }

        portfolioFileInput.value = "";

    });

}


/* =========================================
   LOAD PROFILE FROM BACKEND
========================================= */

async function loadProfile() {

    try {

        const res = await fetch(`${PROFILE_API}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            // token expired / invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "auth.html";
            return;
        }

        const data = await res.json();

        if (!res.ok) {
            profileLoading.innerHTML = `<p>${data.message || "Profile load nahi ho paya."}</p>`;
            return;
        }

        const user = data.user;

        profileHeaderName.textContent = user.name;
        profileRoleBadge.textContent = user.role;

        fieldAvatar.value = user.avatar || "";
        fieldBio.value = user.bio || "";
        bioCount.textContent = (user.bio || "").length;
        fieldCategory.value = user.category || "";
        fieldFollowers.value = user.followers || "";

        fieldInstagram.value = (user.socialLinks && user.socialLinks.instagram) || "";
        fieldYoutube.value = (user.socialLinks && user.socialLinks.youtube) || "";
        fieldTwitter.value = (user.socialLinks && user.socialLinks.twitter) || "";
        fieldWebsite.value = (user.socialLinks && user.socialLinks.website) || "";

        updateAvatarPreview(user.avatar, user.name.charAt(0).toUpperCase());

        portfolioList.innerHTML = "";
        if (user.portfolio && user.portfolio.length > 0) {
            user.portfolio.forEach((url) => addPortfolioRow(url));
        } else {
            addPortfolioRow();
        }
        renderPortfolioPreview();

        profileLoading.style.display = "none";
        profileContent.style.display = "block";

    } catch (error) {
        console.log(error);
        profileLoading.innerHTML = `
            <p>Backend se connect nahi ho paya. Check karo server chal raha hai ya nahi.</p>
        `;
    }

}

loadProfile();


/* =========================================
   SAVE PROFILE
========================================= */

if (profileForm) {

    profileForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const original = saveProfileBtn.textContent;
        saveProfileBtn.disabled = true;
        saveProfileBtn.textContent = "Saving...";
        profileStatusMsg.textContent = "";
        profileStatusMsg.className = "profile-status-msg";

        const portfolio = Array.from(portfolioList.querySelectorAll("input"))
            .map((input) => input.value.trim())
            .filter((url) => url !== "");

        const payload = {
            avatar: fieldAvatar.value.trim(),
            bio: fieldBio.value.trim(),
            category: fieldCategory.value,
            followers: Number(fieldFollowers.value) || 0,
            socialLinks: {
                instagram: fieldInstagram.value.trim(),
                youtube: fieldYoutube.value.trim(),
                twitter: fieldTwitter.value.trim(),
                website: fieldWebsite.value.trim()
            },
            portfolio
        };

        try {

            const res = await fetch(PROFILE_API, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {

                profileStatusMsg.textContent = "Profile saved!";
                profileStatusMsg.classList.add("success");

                // keep navbar name/avatar in sync
                if (storedUser) {
                    storedUser.avatar = payload.avatar;
                    localStorage.setItem("user", JSON.stringify(storedUser));
                }

            } else {
                profileStatusMsg.textContent = data.message || "Save nahi ho paya.";
                profileStatusMsg.classList.add("error");
            }

        } catch (error) {
            profileStatusMsg.textContent = "Server se connect nahi ho paya.";
            profileStatusMsg.classList.add("error");
        }

        saveProfileBtn.disabled = false;
        saveProfileBtn.textContent = original;

    });

}
