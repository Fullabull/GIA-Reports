// START: BELOW IS CODE COPIED FROM ReportFlex.js
// Get elements
//const images = document.querySelectorAll('.image-list img'); !! See below: 'const images' querySelectorAll now uses '.toggle-image' class
const dialog = document.getElementById("imageDialog");
const dialogImage = document.getElementById("dialogImage");
const closeDialogButton = document.getElementById("closeDialogButton");
const content = document.getElementById('content');
const increaseBtn = document.getElementById('increaseFont');
const decreaseBtn = document.getElementById('decreaseFont');
const resetBtn = document.getElementById('resetFont');
let currentFontSize = 16; // Default font size

// END: ABOVE IS CODE COPIED FROM ReportFlex.js

const images = document.querySelectorAll(".toggle-image");
const toggleAllButton = document.getElementById("toggleButton");

// Print exactly what is on the page, as is
document.getElementById('printButton').addEventListener('click', function () {
    window.print();
});

// Toggle all images
toggleAllButton.addEventListener("click", () => {
    let isHidden = images[0].classList.contains("hidden"); // Check first image
    images.forEach(img => img.classList.toggle("hidden", !isHidden)); // Toggle all
});

// Toggle individual images
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function () {
        let img = this.nextElementSibling; // Get the image below the button
        let isHidden = img.classList.contains('hidden');

        img.classList.toggle('hidden', !isHidden);
        this.textContent = isHidden ? 'Hide' : 'Show';

        // Check if all images are hidden
        let allHidden = [...document.querySelectorAll('.toggle-image')].every(img => img.classList.contains('hidden'));
        document.getElementById('toggleButton').textContent = allHidden ? 'Show Images' : 'Hide Images';
    });
});

document.getElementById('toggleButton').addEventListener('click', function () {
    let images = document.querySelectorAll('.toggle-image');
    let shouldHide = this.textContent === 'Hide Images';

    images.forEach(img => {
        img.classList.toggle('hidden', shouldHide);
    });

    // Update all individual image buttons
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.textContent = shouldHide ? 'Show' : 'Hide';
    });

    // Update the global button text
    this.textContent = shouldHide ? 'Show Images' : 'Hide Images';
});

// Reset All Button - Restores ALL images to visible state
document.getElementById("resetButton").addEventListener("click", function () {
    let globalButton = document.getElementById("toggleButton");
    let shouldHide = globalButton.textContent === 'Show Images'; // If global says "Show Images", images are hidden by default

    document.querySelectorAll('.toggle-image').forEach(img => {
        img.classList.toggle('hidden', shouldHide);
    });

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.textContent = shouldHide ? 'Show' : 'Hide';
    });
});

function adjustContentSpacing() {
    let header = document.querySelector('header');
    let content = document.querySelector('#content'); // Target your existing content div

    if (header && content) {
        let headerHeight = header.offsetHeight;
        content.style.marginTop = headerHeight + 'px'; // Push content down dynamically
    }
}

// Run on page load AFTER the DOM is ready
document.addEventListener("DOMContentLoaded", adjustContentSpacing);
window.addEventListener("resize", adjustContentSpacing);


// START: BELOW IS CODE COPIED FROM ReportFlex.js

increaseBtn.addEventListener('click', () => {
    currentFontSize += 1;
    content.style.fontSize = `${currentFontSize}px`;
});

// Decrease font size
decreaseBtn.addEventListener('click', () => {
    if (currentFontSize > 8) { // Set a minimum font size limit
        currentFontSize -= 1;
        content.style.fontSize = `${currentFontSize}px`;
    }
});

// Reset font size
resetBtn.addEventListener('click', () => {
    currentFontSize = 16; // Reset to default
    content.style.fontSize = `${currentFontSize}px`;
});

// END: ABOVE IS CODE COPIED FROM ReportFlex.js

increaseBtn.addEventListener('click', () => {
    currentFontSize += 1;
    content.style.fontSize = `${currentFontSize}px`;
});

// Decrease font size
decreaseBtn.addEventListener('click', () => {
    if (currentFontSize > 8) { // Set a minimum font size limit
        currentFontSize -= 1;
        content.style.fontSize = `${currentFontSize}px`;
    }
});

// Reset font size
resetBtn.addEventListener('click', () => {
    currentFontSize = 16; // Reset to default
    content.style.fontSize = `${currentFontSize}px`;
});

// Array of color combinations (background, text)
const colorCombinations = [
    { background: "black", text: "white" },
    { background: "white", text: "black" },
    { background: "peachpuff", text: "black" },
    { background: "darkslategray", text: "white" },
    { background: "midnightblue", text: "white" },
    { background: "dimgray", text: "white" },
];

// Variable to keep track of the current index
let currentIndex = 1;

function toggleColors() {
    // Access the body element
    const body = document.body;

    // Get the current color combination
    const colors = colorCombinations[currentIndex];

    // Apply the colors
    body.style.backgroundColor = colors.background;
    body.style.color = colors.text;

    // Increment the index and reset to 0 if it reaches the end of the array
    currentIndex = (currentIndex + 1) % colorCombinations.length;
}

const imageSizes = ["tiny-image", "mini-image", "small-image", "medium-image", "large-image", "huge-image"];

function adjustImageSize(direction) {
    document.querySelectorAll('.toggle-image').forEach(img => {
        let currentSize = imageSizes.find(size => img.classList.contains(size));
        let currentIndex = imageSizes.indexOf(currentSize);

        if (direction === "increase" && currentIndex < imageSizes.length - 1) {
            img.classList.remove(currentSize);
            img.classList.add(imageSizes[currentIndex + 1]);
        } else if (direction === "decrease" && currentIndex > 0) {
            img.classList.remove(currentSize);
            img.classList.add(imageSizes[currentIndex - 1]);
        }
    });
}
function setInitialButtonState() {
    let images = document.querySelectorAll('.toggle-image');
    let globalButton = document.getElementById('toggleButton');
    let shouldHide = globalButton.textContent === 'Show Images'; // If global says "Show Images," images are currently hidden

    images.forEach(img => {
        img.classList.toggle('hidden', shouldHide);
    });

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.textContent = shouldHide ? 'Show' : 'Hide';
    });
}

// Run this function on page load
document.addEventListener("DOMContentLoaded", setInitialButtonState);
document.getElementById("increaseImage").addEventListener("click", () => adjustImageSize("increase"));
document.getElementById("decreaseImage").addEventListener("click", () => adjustImageSize("decrease"));