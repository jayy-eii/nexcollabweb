/* =========================================
   FIND CREATORS PAGE
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
        menuBtn.classList.toggle("active");
    });

}


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
   NAVBAR SCROLL EFFECT
========================================= */

const navbar = document.querySelector(".navbar");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.style.height = "64px";
            navbar.style.background = "rgba(7, 7, 12, 0.90)";
        } else {
            navbar.style.height = "72px";
            navbar.style.background = "rgba(10, 10, 17, 0.78)";
        }

    });

}


/* =========================================
   LOGIN STATE CHECK — NAVBAR
========================================= */

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
   BACK TO TOP BUTTON
========================================= */

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }

    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

}


/* =========================================
   REAL CREATOR DATA (fetched from backend)
========================================= */

const CREATORS_API = "https://nexcollabweb-backend.onrender.com/api/creators";

let CREATORS = [];
let creatorsLoaded = false;
let creatorsLoadError = false;

const CATEGORY_GRADIENTS = {
    beauty: "linear-gradient(135deg, #f472b6, #a855f7)",
    tech: "linear-gradient(135deg, #38bdf8, #4f46e5)",
    fitness: "linear-gradient(135deg, #34d399, #0ea5e9)",
    fashion: "linear-gradient(135deg, #fb923c, #ec4899)",
    food: "linear-gradient(135deg, #facc15, #f97316)",
    travel: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    gaming: "linear-gradient(135deg, #a78bfa, #6366f1)",
};

function slugHandle(name) {
    return "@" + name.trim().toLowerCase().replace(/\s+/g, ".");
}

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
   PROFILE VIEW MODAL
========================================= */

function ensureProfileModal() {

    if (document.getElementById("profileViewModal")) return;

    const style = document.createElement("style");
    style.textContent = `
        .pv-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.75);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; padding: 20px;
        }
        .pv-overlay.hidden { display: none; }
        .pv-card {
            background: #12121c;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 32px;
            width: 100%; max-width: 460px;
            color: #fff;
            position: relative;
            max-height: 85vh;
            overflow-y: auto;
        }
        .pv-close {
            position: absolute; top: 16px; right: 16px;
            background: rgba(255,255,255,0.08); border: none;
            width: 32px; height: 32px; border-radius: 50%;
            color: #fff; font-size: 18px; cursor: pointer;
        }
        .pv-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .pv-avatar {
            width: 56px; height: 56px; border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 22px; color: #fff; overflow: hidden;
        }
        .pv-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pv-name { font-size: 20px; font-weight: 700; margin: 0; }
        .pv-handle { color: #999; margin: 2px 0 0; font-size: 14px; }
        .pv-niche {
            margin-left: auto; padding: 6px 12px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.15);
            font-size: 11px; font-weight: 600; letter-spacing: .5px;
            color: #ccc; white-space: nowrap;
        }
        .pv-bio { color: #ccc; line-height: 1.6; margin: 0 0 22px; font-size: 14.5px; }
        .pv-stats {
            display: flex; justify-content: space-around;
            border-top: 1px solid rgba(255,255,255,0.08);
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 16px 0; margin-bottom: 20px;
        }
        .pv-stat { text-align: center; }
        .pv-stat strong { display: block; font-size: 18px; }
        .pv-stat span { font-size: 11px; color: #888; letter-spacing: .5px; }
        .pv-links { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px; }
        .pv-link {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 12px; border-radius: 10px;
            background: rgba(255,255,255,0.06); color: #ddd;
            text-decoration: none; font-size: 13px;
        }
        .pv-link:hover { background: rgba(255,255,255,0.12); }
        .pv-invite-btn {
            width: 100%; padding: 13px; border: none; border-radius: 12px;
            background: linear-gradient(135deg,#7b2ff7,#5b0fc3);
            color: #fff; font-weight: 600; font-size: 15px; cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "profileViewModal";
    overlay.className = "pv-overlay hidden";
    overlay.innerHTML = `
        <div class="pv-card">
            <button class="pv-close" id="pvCloseBtn">&times;</button>
            <div class="pv-header">
                <div class="pv-avatar" id="pvAvatar"></div>
                <div>
                    <h3 class="pv-name" id="pvName"></h3>
                    <p class="pv-handle" id="pvHandle"></p>
                </div>
                <span class="pv-niche" id="pvNiche"></span>
            </div>
            <p class="pv-bio" id="pvBio"></p>
            <div class="pv-stats">
                <div class="pv-stat"><strong id="pvFollowers"></strong><span>FOLLOWERS</span></div>
                <div class="pv-stat"><strong id="pvNicheStat"></strong><span>NICHE</span></div>
                <div class="pv-stat"><strong id="pvJoined"></strong><span>JOINED</span></div>
            </div>
            <div class="pv-links" id="pvLinks"></div>
            <button class="pv-invite-btn" id="pvInviteBtn">Invite to Campaign</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.add("hidden");
    });
    document.getElementById("pvCloseBtn").addEventListener("click", () => {
        overlay.classList.add("hidden");
    });
}

function openProfileModal(creator) {

    ensureProfileModal();

    const overlay = document.getElementById("profileViewModal");
    const gradient = CATEGORY_GRADIENTS[creator.category] || CATEGORY_GRADIENTS.tech;

    const avatarEl = document.getElementById("pvAvatar");
    avatarEl.style.background = gradient;
    avatarEl.innerHTML = creator.avatarUrl
        ? `<img src="${creator.avatarUrl}" alt="${creator.name}" onerror="this.remove()">`
        : creator.initial;

    document.getElementById("pvName").textContent = creator.name;
    document.getElementById("pvHandle").textContent = creator.handle;
    document.getElementById("pvNiche").textContent = creator.category.toUpperCase();
    document.getElementById("pvBio").textContent = creator.bio || "No bio added yet.";
    document.getElementById("pvFollowers").textContent = formatFollowers(creator.followers);
    document.getElementById("pvNicheStat").textContent = creator.category;
    document.getElementById("pvJoined").textContent = formatJoined(creator.joined);

    const linksWrap = document.getElementById("pvLinks");
    linksWrap.innerHTML = "";
    const iconMap = { instagram: "📷", youtube: "▶️", twitter: "𝕏", website: "🌐" };

    Object.entries(creator.socialLinks || {}).forEach(([key, value]) => {
        if (!value) return;
        const a = document.createElement("a");
        a.className = "pv-link";
        a.href = value.startsWith("http") ? value : `https://${value}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `${iconMap[key] || "🔗"} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        linksWrap.appendChild(a);
    });

    document.getElementById("pvInviteBtn").onclick = () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser) {
            alert("Please log in to invite creators to a campaign.");
            window.location.href = "auth.html";
            return;
        }
        alert(`Invitation sent to ${creator.name}! They'll be notified about your campaign.`);
    };

    overlay.classList.remove("hidden");

}

async function fetchCreators() {

    try {

        const res = await fetch(CREATORS_API);
        const data = await res.json();

        CREATORS = (data.creators || []).map((user) => ({
            id: user._id,
            name: user.name,
            handle: slugHandle(user.name),
            category: user.category || "other",
            bio: user.bio,
            followers: user.followers || 0,
            joined: user.createdAt,
            socialLinks: user.socialLinks || {},
            avatarUrl: user.avatar || "",
            initial: user.name.charAt(0).toUpperCase(),
        }));

        creatorsLoaded = true;

    } catch (error) {
        console.log(error);
        creatorsLoadError = true;
    }

    render();

}


/* =========================================
   STATE
========================================= */

let activeCategory = "all";
let searchTerm = "";
let sortBy = "followers";
let visibleCount = 6;
const PAGE_SIZE = 6;


/* =========================================
   ELEMENTS
========================================= */

const creatorsGrid = document.getElementById("creatorsGrid");
const creatorsEmpty = document.getElementById("creatorsEmpty");
const creatorsShowingCount = document.getElementById("creatorsShowingCount");
const creatorsTotalCount = document.getElementById("creatorsTotalCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("creatorSearchInput");
const searchBtn = document.getElementById("creatorSearchBtn");
const sortSelect = document.getElementById("creatorSortSelect");
const filterChips = document.querySelectorAll(".filter-chip");


/* =========================================
   FILTER + SORT
========================================= */

function getFilteredCreators() {

    let list = CREATORS.filter((c) => {

        const matchesCategory = activeCategory === "all" || c.category === activeCategory;

        const term = searchTerm.trim().toLowerCase();
        const matchesSearch =
            term === "" ||
            c.name.toLowerCase().includes(term) ||
            c.handle.toLowerCase().includes(term) ||
            c.category.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;

    });

    list = list.slice().sort((a, b) => {

        if (sortBy === "followers") return b.followers - a.followers;
        if (sortBy === "newest") return new Date(b.joined) - new Date(a.joined);
        if (sortBy === "name") return a.name.localeCompare(b.name);

        return 0;

    });

    return list;

}


/* =========================================
   RENDER
========================================= */

function createTile(creator) {

    const tile = document.createElement("div");
    tile.className = "creator-tile";

    const gradient = CATEGORY_GRADIENTS[creator.category] || CATEGORY_GRADIENTS.tech;

    const avatarInner = creator.avatarUrl
        ? `<img src="${creator.avatarUrl}" alt="${creator.name}" onerror="this.remove()">`
        : creator.initial;

    tile.innerHTML = `
        <div class="creator-tile-top">
            <div class="creator-tile-id">
                <div class="creator-tile-avatar" style="background:${gradient}">
                    ${avatarInner}
                </div>
                <div>
                    <h4>${creator.name}</h4>
                    <span>${creator.handle}</span>
                </div>
            </div>
            <span class="creator-tile-niche">${creator.category.toUpperCase()}</span>
        </div>

        <p class="creator-tile-bio">${creator.bio}</p>

        <div class="creator-tile-stats">
            <div>
                <strong>${formatFollowers(creator.followers)}</strong>
                <span>FOLLOWERS</span>
            </div>
            <div>
                <strong>${creator.category}</strong>
                <span>NICHE</span>
            </div>
            <div>
                <strong>${formatJoined(creator.joined)}</strong>
                <span>JOINED</span>
            </div>
        </div>

        <div class="creator-tile-actions">
            <button type="button" class="creator-view-btn">View Profile</button>
            <button type="button" class="creator-invite-btn">Invite</button>
        </div>
    `;

   tile.querySelector(".creator-view-btn").addEventListener("click", () => {
    window.open(`view-profile.html?id=${creator.id}`, "_blank");
});

    tile.querySelector(".creator-invite-btn").addEventListener("click", () => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            alert("Please log in to invite creators to a campaign.");
            window.location.href = "auth.html";
            return;
        }

        alert(`Invitation sent to ${creator.name}! They'll be notified about your campaign.`);

    });

    return tile;

}

function render() {

    if (!creatorsLoaded && !creatorsLoadError) {
        creatorsGrid.innerHTML = "";
        creatorsEmpty.classList.remove("visible");
        creatorsShowingCount.textContent = "0";
        creatorsTotalCount.textContent = "0";
        loadMoreBtn.style.display = "none";
        return;
    }

    if (creatorsLoadError) {
        creatorsGrid.innerHTML = "";
        creatorsEmpty.querySelector("h3").textContent = "Couldn't load creators";
        creatorsEmpty.querySelector("p").textContent = "Backend se connect nahi ho paya. Check karo server chal raha hai ya nahi.";
        creatorsEmpty.classList.add("visible");
        creatorsShowingCount.textContent = "0";
        creatorsTotalCount.textContent = "0";
        loadMoreBtn.style.display = "none";
        return;
    }

    const filtered = getFilteredCreators();
    const toShow = filtered.slice(0, visibleCount);

    creatorsGrid.innerHTML = "";

    toShow.forEach((creator) => {
        const tile = createTile(creator);
        creatorsGrid.appendChild(tile);
    });

    if (CREATORS.length === 0) {
        creatorsEmpty.querySelector("h3").textContent = "No creators yet";
        creatorsEmpty.querySelector("p").textContent = "Nobody has completed their creator profile yet — be the first!";
    } else {
        creatorsEmpty.querySelector("h3").textContent = "No creators found";
        creatorsEmpty.querySelector("p").textContent = "Try a different search term or clear your filters to see more results.";
    }

    creatorsEmpty.classList.toggle("visible", filtered.length === 0);

    creatorsShowingCount.textContent = toShow.length;
    creatorsTotalCount.textContent = filtered.length;

    loadMoreBtn.style.display = visibleCount >= filtered.length ? "none" : "inline-block";

    // reveal animation
    requestAnimationFrame(() => {
        creatorsGrid.querySelectorAll(".creator-tile").forEach((tile, i) => {
            setTimeout(() => tile.classList.add("in-view"), i * 60);
        });
    });

}


/* =========================================
   EVENTS
========================================= */

filterChips.forEach((chip) => {

    chip.addEventListener("click", () => {

        filterChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");

        activeCategory = chip.dataset.category;
        visibleCount = PAGE_SIZE;

        render();

    });

});

if (searchInput) {

    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        visibleCount = PAGE_SIZE;
        render();
    });

}

if (searchBtn) {
    searchBtn.addEventListener("click", () => render());
}

if (sortSelect) {

    sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        render();
    });

}

if (loadMoreBtn) {

    loadMoreBtn.addEventListener("click", () => {
        visibleCount += PAGE_SIZE;
        render();
    });

}


/* =========================================
   HANDLE ?sort=trending FROM NAVBAR LINK
========================================= */

const params = new URLSearchParams(window.location.search);

if (params.get("sort") === "trending" && sortSelect) {
    sortSelect.value = "newest";
    sortBy = "newest";
}


/* =========================================
   INITIAL LOAD
========================================= */

fetchCreators();
