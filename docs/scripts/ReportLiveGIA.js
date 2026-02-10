// ReportLiveGIA.js

// -----------------------------
// Helper: safe event hookup
// -----------------------------
function on(id, eventName, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(eventName, handler);
    return el;
}

// -----------------------------
// Get elements (may be null on some pages)
// -----------------------------
const dialog = document.getElementById("imageDialog");
const dialogImage = document.getElementById("dialogImage");
const closeDialogButton = document.getElementById("closeDialogButton");

const content = document.getElementById("content");

const increaseBtn = document.getElementById("increaseFont");
const decreaseBtn = document.getElementById("decreaseFont");
const resetBtn    = document.getElementById("resetFont");

let currentFontSize = 16; // Default font size

// NodeLists are fine even if empty
const images = document.querySelectorAll(".toggle-image");

// -----------------------------
// Print button (optional)
// -----------------------------
on("printButton", "click", function () {
    window.print();
});

// -----------------------------
// Images: global toggle + per-image toggles (only if global exists)
// -----------------------------
const toggleAllButton = document.getElementById("toggleButton");

function updateGlobalImageButtonText() {
    const gb = document.getElementById("toggleButton");
    if (!gb) return;

    const imgs = document.querySelectorAll(".toggle-image");
    if (!imgs.length) return;

    const allHidden = [...imgs].every(img => img.classList.contains("hidden"));
    gb.textContent = allHidden ? "Show Images" : "Hide Images";
}

function setAllImagesHidden(shouldHide) {
    const imgs = document.querySelectorAll(".toggle-image");
    if (!imgs.length) return;

    imgs.forEach(img => img.classList.toggle("hidden", shouldHide));

    // Update per-image buttons if they exist
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.textContent = shouldHide ? "Show" : "Hide";
    });

    updateGlobalImageButtonText();
}

// Global toggle button handler (ONLY ONE)
if (toggleAllButton) {
    toggleAllButton.addEventListener("click", function () {
        const imgs = document.querySelectorAll(".toggle-image");
        if (!imgs.length) return;

        const shouldHide = (this.textContent === "Hide Images");
        setAllImagesHidden(shouldHide);
    });
}

// Individual image toggle buttons (safe even if none exist)
document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", function () {
        const img = this.nextElementSibling; // image below the button
        if (!img) return;

        const isHidden = img.classList.contains("hidden");
        img.classList.toggle("hidden", !isHidden);
        this.textContent = isHidden ? "Hide" : "Show";

        updateGlobalImageButtonText();
    });
});

// Reset images button (optional)
on("resetButton", "click", function () {
    const gb = document.getElementById("toggleButton");
    if (!gb) return;

    // If global says "Show Images", images are currently hidden
    const shouldHide = (gb.textContent === "Show Images");
    setAllImagesHidden(shouldHide);
});

// Initial images state (only meaningful if toggleButton exists)
function setInitialButtonState() {
    const gb = document.getElementById("toggleButton");
    if (!gb) return;

    const imgs = document.querySelectorAll(".toggle-image");
    if (!imgs.length) return;

    const shouldHide = (gb.textContent === "Show Images");
    setAllImagesHidden(shouldHide);
}

document.addEventListener("DOMContentLoaded", setInitialButtonState);

// -----------------------------
// Header spacing logic
// -----------------------------
function adjustContentSpacing() {
    const header = document.querySelector("header");
    if (!header) return;

    const hidden = header.classList.contains("hdr-hidden");
    const h = header.offsetHeight;

    // Save measured height so we can restore instantly on show
    document.documentElement.style.setProperty("--hdr-last", h + "px");

    // Apply current offset
    document.documentElement.style.setProperty("--hdr-offset", hidden ? "0px" : (h + "px"));
}

document.addEventListener("DOMContentLoaded", adjustContentSpacing);
window.addEventListener("resize", adjustContentSpacing);

// -----------------------------
// Font size controls (optional)
// -----------------------------
if (content && increaseBtn && decreaseBtn && resetBtn) {
    increaseBtn.addEventListener("click", () => {
        currentFontSize += 1;
        content.style.fontSize = `${currentFontSize}px`;
    });

    decreaseBtn.addEventListener("click", () => {
        if (currentFontSize > 8) {
            currentFontSize -= 1;
            content.style.fontSize = `${currentFontSize}px`;
        }
    });

    resetBtn.addEventListener("click", () => {
        currentFontSize = 16;
        content.style.fontSize = `${currentFontSize}px`;
    });
}

// -----------------------------
// Color toggle (used by header onclick)
// -----------------------------
const colorCombinations = [
    { background: "black",        text: "white" },
    { background: "white",        text: "black" },
    { background: "peachpuff",    text: "black" },
    { background: "darkslategray",text: "white" },
    { background: "midnightblue", text: "white" },
    { background: "dimgray",      text: "white" },
];

let currentIndex = 1;

function toggleColors() {
    const body = document.body;
    const colors = colorCombinations[currentIndex];

    body.style.backgroundColor = colors.background;
    body.style.color = colors.text;

    currentIndex = (currentIndex + 1) % colorCombinations.length;
}

// -----------------------------
// Image sizing controls (optional)
// -----------------------------
const imageSizes = ["tiny-image", "mini-image", "small-image", "medium-image", "large-image", "huge-image"];

function adjustImageSize(direction) {
    document.querySelectorAll(".toggle-image").forEach(img => {
        const currentSize = imageSizes.find(size => img.classList.contains(size));
        if (!currentSize) return;

        const idx = imageSizes.indexOf(currentSize);

        if (direction === "increase" && idx < imageSizes.length - 1) {
            img.classList.remove(currentSize);
            img.classList.add(imageSizes[idx + 1]);
        } else if (direction === "decrease" && idx > 0) {
            img.classList.remove(currentSize);
            img.classList.add(imageSizes[idx - 1]);
        }
    });
}

on("increaseImage", "click", () => adjustImageSize("increase"));
on("decreaseImage", "click", () => adjustImageSize("decrease"));

// -----------------------------
// Auto-hide header on scroll
// -----------------------------
(function () {
    const header = document.querySelector("header");
    if (!header) return;

    // Tune these thresholds
    const TOP_LOCK_PX = 8;          // always show near the top
    const HIDE_AFTER_DOWN_PX = 36;  // sustained down needed to hide
    const SHOW_AFTER_UP_PX = 24;    // sustained up needed to show
    const JITTER_PX = 2;            // ignore tiny noise

    let lastY = window.scrollY || 0;
    let accDown = 0;
    let accUp = 0;
    let ticking = false;

    function showHeader() {
        header.classList.remove("hdr-hidden");
        const last = getComputedStyle(document.documentElement).getPropertyValue("--hdr-last").trim();
        document.documentElement.style.setProperty("--hdr-offset", last || (header.offsetHeight + "px"));
    }

    function hideHeader() {
        header.classList.add("hdr-hidden");
        document.documentElement.style.setProperty("--hdr-offset", "0px");
    }

    function handleScroll() {
        const y = window.scrollY || 0;
        const dy = y - lastY;
        lastY = y;

        if (y <= TOP_LOCK_PX) {
            accDown = 0;
            accUp = 0;
            showHeader();
            return;
        }

        if (Math.abs(dy) < JITTER_PX) return;

        if (dy > 0) {
            accDown += dy;
            accUp = 0;

            if (accDown >= HIDE_AFTER_DOWN_PX) {
                hideHeader();
                accDown = 0;
            }
        } else {
            accUp += -dy;
            accDown = 0;

            if (accUp >= SHOW_AFTER_UP_PX) {
                showHeader();
                accUp = 0;
                adjustContentSpacing(); // re-measure in case header wraps
            }
        }
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    document.addEventListener("DOMContentLoaded", () => {
        adjustContentSpacing();
        showHeader();
    });
})();
