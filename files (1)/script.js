/* =========================================
   NEXCOLLAB NAVBAR JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("mobile-open");

    menuBtn.classList.toggle("active");

});


/* =========================================
   CREATE FLOATING PARTICLES
========================================= */

const particlesContainer =
    document.getElementById("particles");

const particleCount = 35;

for (let i = 0; i < particleCount; i++) {

    const particle = document.createElement("div");

    particle.classList.add("particle");

    // Random horizontal position
    particle.style.left =
        Math.random() * 100 + "%";

    // Random animation duration
    particle.style.setProperty(
        "--duration",
        (6 + Math.random() * 10) + "s"
    );

    // Random delay
    particle.style.animationDelay =
        (-Math.random() * 10) + "s";

    // Random size
    const size =
        1 + Math.random() * 2;

    particle.style.width = size + "px";
    particle.style.height = size + "px";

    particlesContainer.appendChild(particle);
}


/* =========================================
   MOUSE PARALLAX EFFECT
========================================= */

const shapes =
    document.querySelectorAll(
        ".glass-shape, .orb"
    );

document.addEventListener("mousemove", (event) => {

    const x =
        (event.clientX / window.innerWidth - 0.5);

    const y =
        (event.clientY / window.innerHeight - 0.5);

    shapes.forEach((shape, index) => {

        const strength =
            index % 2 === 0 ? 12 : 7;

        shape.style.marginLeft =
            `${x * strength}px`;

        shape.style.marginTop =
            `${y * strength}px`;

    });

});


/* =========================================
   NAVBAR MOUSE TILT
========================================= */

const navbar =
    document.querySelector(".navbar");

navbar.addEventListener("mousemove", (event) => {

    const rect =
        navbar.getBoundingClientRect();

    const x =
        event.clientX - rect.left;

    const y =
        event.clientY - rect.top;

    const rotateY =
        ((x / rect.width) - 0.5) * 2;

    const rotateX =
        ((y / rect.height) - 0.5) * -2;

    navbar.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;

});


navbar.addEventListener("mouseleave", () => {

    navbar.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";

});


/* =========================================
   SCROLL EFFECT
========================================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.height = "64px";

        navbar.style.background =
            "rgba(7, 7, 12, 0.90)";

    } else {

        navbar.style.height = "72px";

        navbar.style.background =
            "rgba(10, 10, 17, 0.78)";

    }

});
const marqueeWrapper = document.querySelector(".marquee-wrapper");
const marqueeTrack = document.querySelector(".marquee-track");

marqueeWrapper.addEventListener("mouseenter", () => {
    marqueeTrack.style.animationPlayState = "paused";
});

marqueeWrapper.addEventListener("mouseleave", () => {
    marqueeTrack.style.animationPlayState = "running";
});
/* =====================================================
   3D CONNECTION SECTION
===================================================== */

const connectionSection =
    document.querySelector("#connection3D");

const connectionScene =
    document.querySelector("#connectionScene");



/* =====================================================
   SCROLL BASED 3D MOVEMENT
===================================================== */

function updateConnection3D() {

    if (!connectionSection || !connectionScene) {
        return;
    }


    const rect =
        connectionSection.getBoundingClientRect();


    const windowHeight =
        window.innerHeight;


    /*
       Section screen ke andar kitna hai
    */

    const progress =
        (windowHeight - rect.top) /
        (windowHeight + rect.height);


    /*
       Limit between 0 and 1
    */

    const clampedProgress =
        Math.max(
            0,
            Math.min(1, progress)
        );


    /*
       Scroll ke according 3D rotation
    */

    const rotateX =
        (clampedProgress - 0.5) * 8;


    const translateY =
        (clampedProgress - 0.5) * -25;


    connectionScene.style.transform = `

        rotateX(${rotateX}deg)

        translateY(${translateY}px)

    `;

}


/* NOTE: the instant scroll → updateConnection3D() binding was
   replaced by the buttery lerp-smoothed version further down
   this file (see "LERP-SMOOTHED 3D CONNECTION SCROLL"), so the
   3D scene glides instead of snapping on every scroll tick. */



/* =====================================================
   MOUSE PARALLAX
===================================================== */

if (connectionSection) {

    connectionSection.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                connectionSection.getBoundingClientRect();


            const mouseX =
                event.clientX - rect.left;


            const mouseY =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            /*
               Mouse distance
            */

            const moveX =
                (mouseX - centerX) / 45;


            const moveY =
                (mouseY - centerY) / 45;


            connectionScene.style.transform = `

                rotateX(${-moveY}deg)

                rotateY(${moveX}deg)

                translateZ(20px)

            `;

        }
    );


    /*
       Mouse leave
    */

    connectionSection.addEventListener(
        "mouseleave",
        function () {

            connectionScene.style.transform = `
                rotateX(0deg)
                rotateY(0deg)
                translateZ(0)
            `;

        }
    );

}



/* =====================================================
   CARD MOUSE TILT
===================================================== */

const connectionCards =
    document.querySelectorAll(
        ".connection-card"
    );


connectionCards.forEach(
    function (card) {

        card.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;


                const y =
                    event.clientY - rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) /
                    centerY) * -8;


                const rotateY =
                    ((x - centerX) /
                    centerX) * 8;


                card.style.transform = `

                    translateY(-50%)

                    translateZ(110px)

                    rotateX(${rotateX}deg)

                    rotateY(${rotateY}deg)

                    scale(1.04)

                `;

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                /*
                   Original position reset
                */

                if (
                    card.classList.contains(
                        "creator-card"
                    )
                ) {

                    card.style.transform = `
                        translateY(-50%)
                        translateZ(70px)
                        rotateY(10deg)
                    `;

                }


                if (
                    card.classList.contains(
                        "brand-card"
                    )
                ) {

                    card.style.transform = `
                        translateY(-50%)
                        translateZ(70px)
                        rotateY(-10deg)
                    `;

                }

            }
        );

    }
);



/* NOTE: initial call moved to kickConnectionLerp() at the
   bottom of this file, alongside the lerp-smoothed scroll setup. */

/* =========================================
   STAT COUNT-UP ON SCROLL INTO VIEW
========================================= */

const statNumbers = document.querySelectorAll(".stat-num");

function animateStat(el) {

    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {

        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);

        el.textContent =
            (target >= 1000 ? value.toLocaleString("en-IN") : value) + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }

    }

    requestAnimationFrame(tick);

}

if (statNumbers.length) {

    const statObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                animateStat(entry.target);
                statObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.4 });

    statNumbers.forEach((el) => statObserver.observe(el));

}


/* =========================================
   LIVE VIEWER COUNT — GENTLE RANDOM TICK
   (purely cosmetic, no real data)
========================================= */

const viewerEls = document.querySelectorAll(".viewer-count");

viewerEls.forEach((el) => {

    const base = parseInt(el.getAttribute("data-base"), 10) || 100;

    setInterval(() => {

        const drift = Math.floor(Math.random() * 9) - 4;
        const next = Math.max(base - 20, base + drift);

        el.textContent = next.toLocaleString("en-IN");

    }, 2200);

});


/* =========================================
   SCROLL REVEAL FOR NEW SECTIONS
========================================= */

const revealTargets = document.querySelectorAll(
    ".trust-step, .live-card, .stat-item, .footer-stat"
);

if (revealTargets.length) {

    revealTargets.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry, i) => {

            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, i * 80);

                revealObserver.unobserve(entry.target);

            }

        });

    }, { threshold: 0.2 });

    revealTargets.forEach((el) => revealObserver.observe(el));

}


/* =========================================
   SCROLL PROGRESS BAR
========================================= */

const scrollProgressFill = document.getElementById("scrollProgressFill");

function updateScrollProgress() {

    if (!scrollProgressFill) return;

    const scrollTop = window.scrollY;
    const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgressFill.style.width = percent + "%";

}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();


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
   GLOBAL REVEAL-ON-SCROLL
   Fades + lifts key sections into view as the
   user scrolls, instead of everything popping
   in instantly on load
========================================= */

const globalRevealTargets = document.querySelectorAll(
    ".hero-content, .category-section .section-heading, .connection-heading, .trust-heading, .live-heading, .footer-top"
);

globalRevealTargets.forEach((el) => el.classList.add("reveal-init"));

const globalRevealObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            globalRevealObserver.unobserve(entry.target);
        }

    });

}, { threshold: 0.15 });

globalRevealTargets.forEach((el) => globalRevealObserver.observe(el));


/* =========================================
   LERP-SMOOTHED 3D CONNECTION SCROLL
   Replaces the instant scroll-jump transform
   with a buttery eased follow, so the 3D
   scene glides instead of snapping on scroll
========================================= */

let connectionTargetRotate = 0;
let connectionTargetTranslate = 0;
let connectionCurrentRotate = 0;
let connectionCurrentTranslate = 0;
let connectionRafRunning = false;

function computeConnectionTargets() {

    if (!connectionSection || !connectionScene) return;

    const rect = connectionSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress =
        (windowHeight - rect.top) / (windowHeight + rect.height);

    const clampedProgress = Math.max(0, Math.min(1, progress));

    connectionTargetRotate = (clampedProgress - 0.5) * 8;
    connectionTargetTranslate = (clampedProgress - 0.5) * -25;

}

function connectionLerpLoop() {

    if (!connectionScene) {
        connectionRafRunning = false;
        return;
    }

    const ease = 0.08;

    connectionCurrentRotate +=
        (connectionTargetRotate - connectionCurrentRotate) * ease;

    connectionCurrentTranslate +=
        (connectionTargetTranslate - connectionCurrentTranslate) * ease;

    connectionScene.style.transform = `
        rotateX(${connectionCurrentRotate}deg)
        translateY(${connectionCurrentTranslate}px)
    `;

    const stillMoving =
        Math.abs(connectionTargetRotate - connectionCurrentRotate) > 0.01 ||
        Math.abs(connectionTargetTranslate - connectionCurrentTranslate) > 0.01;

    if (stillMoving) {
        requestAnimationFrame(connectionLerpLoop);
    } else {
        connectionRafRunning = false;
    }

}

function kickConnectionLerp() {

    computeConnectionTargets();

    if (!connectionRafRunning) {
        connectionRafRunning = true;
        requestAnimationFrame(connectionLerpLoop);
    }

}

window.addEventListener("scroll", kickConnectionLerp, { passive: true });
kickConnectionLerp();


/* =========================================
   HOW IT WORKS — SCROLL-LINKED TIMELINE
   Line fills as you scroll through the
   section, and each step lights up with a
   smooth card slide-in when it's reached
========================================= */

const hiwTimeline = document.getElementById("hiwTimeline");
const hiwLineFill = document.getElementById("hiwLineFill");
const hiwSteps = document.querySelectorAll(".hiw-step");

function updateHiwLine() {

    if (!hiwTimeline || !hiwLineFill) return;

    const rect = hiwTimeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress =
        (windowHeight * 0.75 - rect.top) / rect.height;

    const clamped = Math.max(0, Math.min(1, progress));

    hiwLineFill.style.height = (clamped * 100) + "%";

}

window.addEventListener("scroll", updateHiwLine, { passive: true });
window.addEventListener("resize", updateHiwLine);
updateHiwLine();

if (hiwSteps.length) {

    const hiwObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("hiw-active");
                hiwObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.4 });

    hiwSteps.forEach((step) => hiwObserver.observe(step));

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