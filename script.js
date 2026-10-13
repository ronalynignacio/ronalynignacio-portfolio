// MOBILE MENU

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});


// HERO HEADLINE — shown immediately (no intro animation)

document.querySelectorAll(".hero h1 .line-wrap").forEach(function (line) {
    line.textContent = line.getAttribute("data-line");
});


// SCROLL REVEAL ANIMATIONS

const revealEls = document.querySelectorAll(".reveal");

const staggerGroups = document.querySelectorAll(
    ".skills-grid, .journey-col, .certificate-grid, .contact-grid"
);

staggerGroups.forEach(function (group) {
    const items = group.querySelectorAll(".reveal-stagger");
    items.forEach(function (item, index) {
        item.style.setProperty("--stagger-index", index);
    });
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach(function (el) {
        observer.observe(el);
    });

    document.querySelectorAll(".journey-card, .skill-card").forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
} else {
    revealEls.forEach(function (el) {
        el.classList.add("in-view");
    });
}


// ACTIVE NAV LINK ON SCROLL

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navAnchors.forEach(function (a) {
                        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
                    });
                }
            });
        },
        { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" }
    );

    sections.forEach(function (s) { navObserver.observe(s); });
}


// CUSTOM CURSOR — dot + trailing ring

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (isFinePointer && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll("a, button, .skill-card, .journey-card, .certificate-card").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursorRing.classList.add("grow"); });
        el.addEventListener("mouseleave", function () { cursorRing.classList.remove("grow"); });
    });
}


// HERO MOUSE-FOLLOW GLOW

const hero = document.getElementById("home");

if (hero) {
    hero.addEventListener("mousemove", function (e) {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty("--mx", x + "%");
        hero.style.setProperty("--my", y + "%");
    });
}


// SKILL CARD 3D FLIP
// Hover handles desktop; focus/tap handles keyboard and touch devices.
document.querySelectorAll(".skill-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
        if (window.matchMedia("(pointer: coarse)").matches) {
            card.classList.toggle("is-flipped");
        }
    });

    card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.classList.toggle("is-flipped");
        }
    });

    card.addEventListener("focusout", function (e) {
        if (!card.contains(e.relatedTarget)) {
            card.classList.remove("is-flipped");
        }
    });
});


// CERTIFICATE IMAGE LIGHTBOX
const certificateLightbox = document.getElementById("certificateLightbox");
const certificateLightboxImage = document.getElementById("certificateLightboxImage");
const certificateCards = document.querySelectorAll(".certificate-card");

if (certificateLightbox && certificateLightboxImage && certificateCards.length) {
    let activeCertificateCard = null;

    function closeCertificateLightbox() {
        certificateLightbox.classList.remove("is-open");
        certificateLightbox.setAttribute("aria-hidden", "true");
        certificateLightboxImage.removeAttribute("src");
        document.body.classList.remove("lightbox-open");

        if (activeCertificateCard) {
            activeCertificateCard.focus({ preventScroll: true });
            activeCertificateCard = null;
        }
    }

    function openCertificateLightbox(card) {
        const certificateImage = card.querySelector(".certificate-media img");
        if (!certificateImage) return;

        const source = certificateImage.currentSrc || certificateImage.getAttribute("src");
        if (!source) return;

        // Preload the exact certificate asset first so the modal never opens blank.
        const preview = new Image();
        preview.onload = function () {
            activeCertificateCard = card;
            certificateLightboxImage.src = source;
            certificateLightboxImage.alt = certificateImage.alt || "Full certificate preview";
            certificateLightbox.classList.add("is-open");
            certificateLightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
        };
        preview.onerror = function () {
            certificateLightboxImage.removeAttribute("src");
        };
        preview.src = source;
    }

    certificateCards.forEach(function (card) {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Open certificate preview");

        card.addEventListener("click", function () {
            openCertificateLightbox(card);
        });

        card.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openCertificateLightbox(card);
            }
        });
    });

    certificateLightbox.querySelectorAll("[data-lightbox-close]").forEach(function (closeControl) {
        closeControl.addEventListener("click", closeCertificateLightbox);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && certificateLightbox.classList.contains("is-open")) {
            closeCertificateLightbox();
        }
    });
}

// CONTACT FORM — simple client-side confirmation (no backend wired up)

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const button = contactForm.querySelector("button");
        const originalText = button.textContent;
        button.textContent = "Message sent";
        contactForm.reset();
        setTimeout(function () {
            button.textContent = originalText;
        }, 2500);
    });
}


// LIGHT / DARK MODE
const themeToggle=document.getElementById("themeToggle");const themeIcon=themeToggle?themeToggle.querySelector(".theme-icon"):null;const themeLabel=themeToggle?themeToggle.querySelector(".theme-label"):null;
function applyTheme(theme){const isLight=theme==="light";document.documentElement.classList.toggle("light-mode",isLight);if(themeIcon)themeIcon.textContent=isLight?"☀":"☾";if(themeLabel)themeLabel.textContent=isLight?"Light":"Dark";if(themeToggle){themeToggle.setAttribute("aria-label",isLight?"Switch to dark mode":"Switch to light mode");themeToggle.setAttribute("title",isLight?"Switch to dark mode":"Switch to light mode")}}
applyTheme(localStorage.getItem("portfolio-theme")||"dark");if(themeToggle){themeToggle.addEventListener("click",function(){const nextTheme=document.documentElement.classList.contains("light-mode")?"dark":"light";applyTheme(nextTheme);localStorage.setItem("portfolio-theme",nextTheme)})}

// MY JOURNEY — two-slide Education / Seminars & Trainings presentation
const journeySlider = document.querySelector("[data-journey-slider]");

if (journeySlider) {
    const journeySlides = Array.from(journeySlider.querySelectorAll("[data-journey-slide]"));
    const journeyDots = Array.from(journeySlider.querySelectorAll("[data-journey-goto]"));
    const journeyPrev = journeySlider.querySelector("[data-journey-prev]");
    const journeyNext = journeySlider.querySelector("[data-journey-next]");
    let journeyIndex = 0;

    function showJourneySlide(index) {
        journeyIndex = (index + journeySlides.length) % journeySlides.length;

        journeySlides.forEach(function (slide, i) {
            const active = i === journeyIndex;
            slide.hidden = !active;
            slide.classList.toggle("is-active", active);
        });

        journeyDots.forEach(function (dot, i) {
            const active = i === journeyIndex;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-selected", active ? "true" : "false");
        });

        if (journeyPrev) journeyPrev.disabled = journeySlides.length < 2;
        if (journeyNext) journeyNext.disabled = journeySlides.length < 2;

        const activeSlide = journeySlides[journeyIndex];
        if (activeSlide) {
            activeSlide.querySelectorAll(".reveal").forEach(function (el, i) {
                el.classList.remove("in-view");
                window.setTimeout(function () {
                    el.classList.add("in-view");
                }, 60 + (i * 45));
            });
        }
    }

    journeyDots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            showJourneySlide(Number(dot.getAttribute("data-journey-goto")));
        });
    });

    if (journeyPrev) {
        journeyPrev.addEventListener("click", function () {
            showJourneySlide(journeyIndex - 1);
        });
    }

    if (journeyNext) {
        journeyNext.addEventListener("click", function () {
            showJourneySlide(journeyIndex + 1);
        });
    }

    journeySlider.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") showJourneySlide(journeyIndex - 1);
        if (e.key === "ArrowRight") showJourneySlide(journeyIndex + 1);
    });

    showJourneySlide(0);
}


// RONA AI FLOATING CHAT WIDGET
const chatWidget = document.getElementById("chatWidget");
const chatLauncher = document.getElementById("chatWidgetLauncher");
const chatPanel = document.getElementById("chatWidgetPanel");
const chatClose = document.getElementById("chatWidgetClose");

if (chatWidget && chatLauncher && chatPanel) {
    function setChatOpen(open) {
        chatPanel.hidden = !open;
        chatWidget.classList.toggle("is-open", open);
        chatLauncher.setAttribute("aria-expanded", open ? "true" : "false");
        chatLauncher.setAttribute("aria-label", open ? "Close chat with Rona" : "Open chat with Rona");
    }

    chatLauncher.addEventListener("click", function () {
        setChatOpen(chatPanel.hidden);
    });

    if (chatClose) {
        chatClose.addEventListener("click", function () {
            setChatOpen(false);
            chatLauncher.focus();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !chatPanel.hidden) {
            setChatOpen(false);
            chatLauncher.focus();
        }
    });
}
