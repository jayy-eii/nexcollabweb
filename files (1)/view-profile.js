/* =========================================
   VIEW PROFILE PAGE (public, read-only)
========================================= */

const PROFILE_API = "http://localhost:3000/api/profile";

const CATEGORY_GRADIENTS = {
    beauty: "linear-gradient(135deg, #f472b6, #a855f7)",
    tech: "linear-gradient(135deg, #38bdf8, #4f46e5)",
    fitness: "linear-gradient(135deg, #34d399, #0ea5e9)",
    fashion: "linear-gradient(135deg, #fb923c, #ec4899)",
    food: "linear-gradient(135deg, #facc15, #f97316)",
    travel: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    gaming: "linear-gradient(135deg, #a78bfa, #6366f1)",
};

function formatFollowers(n) {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return String(n || 0);
}

function formatJoined(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}


/* =========================================
   PARTICLES + NAVBAR LOGIN STATE
========================================= */

const particlesContainer = document.getElementById("particles");
if (particlesContainer) {
    for (let i = 0; i < 35; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        p.style.left = Math.random() * 100 + "%";
        p.style.setProperty("--duration", (6 + Math.random() * 10) + "s");
        p.style.animationDelay = (-Math.random() * 10) + "s";
        const size = 1 + Math.random() * 2;
        p.style.width = size + "px";
        p.style.height = size + "px";
        particlesContainer.appendChild(p);
    }
}

const navAuthButtons = document.getElementById("navAuthButtons");
const navUserMenu = document.getElementById("navUserMenu");
const navUserName = document.getElementById("navUserName");
const navUserAvatar = document.getElementById("navUserAvatar");
const navLogoutBtn = document.getElementById("navLogoutBtn");
const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (loggedInUser && navAuthButtons && navUserMenu) {
    navAuthButtons.style.display = "none";
    navUserMenu.style.display = "flex";
    navUserName.textContent = loggedInUser.name;
    navUserAvatar.textContent = loggedInUser.name.charAt(0).toUpperCase();
}

if (navLogoutBtn) {
    navLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    });
}


/* =========================================
   LOAD CREATOR PROFILE BY ID (from URL)
========================================= */

const vpLoading = document.getElementById("vpLoading");
const vpCard = document.getElementById("vpCard");

async function loadCreatorProfile() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        vpLoading.textContent = "No profile ID provided.";
        return;
    }

    try {

        const res = await fetch(`${PROFILE_API}/${id}`);
        const data = await res.json();

        if (!res.ok) {
            vpLoading.textContent = data.message || "Profile not found.";
            return;
        }

        const user = data.user;
        const gradient = CATEGORY_GRADIENTS[user.category] || CATEGORY_GRADIENTS.tech;

        const avatarEl = document.getElementById("vpAvatar");
        avatarEl.style.background = gradient;
        avatarEl.innerHTML = user.avatar
            ? `<img src="${user.avatar}" alt="${user.name}" onerror="this.remove()">`
            : user.name.charAt(0).toUpperCase();

        document.getElementById("vpName").textContent = user.name;
        document.getElementById("vpHandle").textContent = "@" + user.name.trim().toLowerCase().replace(/\s+/g, ".");
        document.getElementById("vpNiche").textContent = (user.category || "other").toUpperCase();
        document.getElementById("vpBio").textContent = user.bio || "No bio added yet.";
        document.getElementById("vpFollowers").textContent = formatFollowers(user.followers);
        document.getElementById("vpNicheStat").textContent = user.category || "other";
        document.getElementById("vpJoined").textContent = formatJoined(user.createdAt);

        const linksWrap = document.getElementById("vpLinks");
        const iconMap = { instagram: "📷", youtube: "▶️", twitter: "𝕏", website: "🌐" };

        Object.entries(user.socialLinks || {}).forEach(([key, value]) => {
            if (!value) return;
            const a = document.createElement("a");
            a.className = "vp-link";
            a.href = value.startsWith("http") ? value : `https://${value}`;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.innerHTML = `${iconMap[key] || "🔗"} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
            linksWrap.appendChild(a);
        });

        const portfolioWrap = document.getElementById("vpPortfolio");
        (user.portfolio || []).forEach((url) => {
            const img = document.createElement("img");
            img.src = url;
            img.onerror = () => img.remove();
            portfolioWrap.appendChild(img);
        });

        document.getElementById("vpInviteBtn").addEventListener("click", () => {
            if (!loggedInUser) {
                alert("Please log in to invite creators to a campaign.");
                window.location.href = "auth.html";
                return;
            }
            alert(`Invitation sent to ${user.name}! They'll be notified about your campaign.`);
        });

        vpLoading.style.display = "none";
        vpCard.style.display = "block";

    } catch (error) {
        console.log(error);
        vpLoading.textContent = "Backend se connect nahi ho paya. Check karo server chal raha hai ya nahi.";
    }

}

loadCreatorProfile();