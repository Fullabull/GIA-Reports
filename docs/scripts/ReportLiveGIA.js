// START: Functions that can live outside DOMContentLoaded

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

function adjustContentSpacing() {
    let header = document.querySelector('header');
    let content = document.querySelector('#content');
    if (header && content) {
        let headerHeight = header.offsetHeight;
        content.style.marginTop = headerHeight + 'px';
    }
}

function setInitialButtonState() {
    let images = document.querySelectorAll('.toggle-image');
    let globalButton = document.getElementById('toggleButton');
    let shouldHide = globalButton.textContent === 'Show Images';

    images.forEach(img => {
        img.classList.toggle('hidden', shouldHide);
    });

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.textContent = shouldHide ? 'Show' : 'Hide';
    });
}

// Attach spacing adjustment on load/resize
document.addEventListener("DOMContentLoaded", adjustContentSpacing);
window.addEventListener("resize", adjustContentSpacing);

// END: Functions that can live outside DOMContentLoaded

// START: Main DOM logic
document.addEventListener("DOMContentLoaded", function () {
    const dialog = document.getElementById("imageDialog");
    const dialogImage = document.getElementById("dialogImage");
    const closeDialogButton = document.getElementById("closeDialogButton");
    const content = document.getElementById('content');
    const increaseBtn = document.getElementById('increaseFont');
    const decreaseBtn = document.getElementById('decreaseFont');
    const resetBtn = document.getElementById('resetFont');
    let currentFontSize = 16;

    const images = document.querySelectorAll(".toggle-image");
    const toggleAllButton = document.getElementById("toggleButton");

    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function () {
            window.print();
        });
    }

    if (toggleAllButton) {
        toggleAllButton.addEventListener("click", () => {
            let isHidden = images.length > 0 && images[0].classList.contains("hidden");
            images.forEach(img => img.classList.toggle("hidden", !isHidden));
        });
    }

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function () {
            let img = this.nextElementSibling;
            if (!img) return;
            let isHidden = img.classList.contains('hidden');

            img.classList.toggle('hidden', !isHidden);
            this.textContent = isHidden ? 'Hide' : 'Show';

            let allHidden = [...document.querySelectorAll('.toggle-image')].every(img => img.classList.contains('hidden'));
            let globalToggle = document.getElementById('toggleButton');
            if (globalToggle) {
                globalToggle.textContent = allHidden ? 'Show Images' : 'Hide Images';
            }
        });
    });

    const resetButton = document.getElementById("resetButton");
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            let globalButton = document.getElementById("toggleButton");
            let shouldHide = globalButton && globalButton.textContent === 'Show Images';

            document.querySelectorAll('.toggle-image').forEach(img => {
                img.classList.toggle('hidden', shouldHide);
            });

            document.querySelectorAll('.toggle-btn').forEach(button => {
                button.textContent = shouldHide ? 'Show' : 'Hide';
            });
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            currentFontSize += 1;
            content.style.fontSize = `${currentFontSize}px`;
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (currentFontSize > 8) {
                currentFontSize -= 1;
                content.style.fontSize = `${currentFontSize}px`;
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFontSize = 16;
            content.style.fontSize = `${currentFontSize}px`;
        });
    }

    setInitialButtonState();

    const increaseImageBtn = document.getElementById("increaseImage");
    const decreaseImageBtn = document.getElementById("decreaseImage");

    if (increaseImageBtn) {
        increaseImageBtn.addEventListener("click", () => adjustImageSize("increase"));
    }

    if (decreaseImageBtn) {
        decreaseImageBtn.addEventListener("click", () => adjustImageSize("decrease"));
    }
});
