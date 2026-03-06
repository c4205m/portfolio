// INTERSECTION TRACKING
const observer = new IntersectionObserver(observerAction, {root: null, rootMargin: "-40px 0px 0px 0px", threshold: 0});
const observer2 = new IntersectionObserver(observerAction, {root: null, rootMargin: "-20% 0px -30% 0px", threshold: .8});

let observeTargets = [];
observeTargets = [...observeTargets, ...document.querySelectorAll("section")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".img-title")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".gallery-item")];
observeTargets = [...observeTargets, ...document.querySelectorAll("video")];
observeTargets = [...observeTargets, ...document.querySelectorAll("h2")];
observeTargets.forEach(e => observer.observe(e));

observeTargets = [];
observeTargets = [...observeTargets, ...document.querySelectorAll(".link-emphasize")];
observeTargets.forEach(e => observer2.observe(e));

function observerAction(els){
    els.forEach((el) => {
        if(el.isIntersecting){
            if(el.target.tagName === "VIDEO"){
                console.log(el.target)
                el.target.play();
            }

            el.target.classList.add("show");
        } else {
            el.target.classList.remove("show");
        }
    })
}

// THEME PERSISTENCE
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    const radio = document.querySelector(`#theme [value="${savedTheme}"]`);
    if (radio) radio.checked = true;
}
document.querySelectorAll('#theme input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
        localStorage.setItem('theme', input.value);
        document.documentElement.setAttribute('data-theme', input.value);
    });
});

// RESUME PAGE HEADER
const resumeHeader = document.querySelector(".resume-header");
if (resumeHeader) {
    let ticking = false;
    const siteHeader = document.querySelector("header");
    const threshold = resumeHeader.offsetTop;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const triggered = window.scrollY > threshold;
                siteHeader.classList.toggle("header-hidden", triggered);
                document.documentElement.classList.toggle("resume-scrolled", triggered);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// HTML ONCLICKS
const header = document.querySelector("header");
let modalMode = false;
let galleryGrid;
let lastClickedItem;
function openGalleryModal(el) {
    if(modalMode) return
    galleryGrid = document.querySelector(".gallery-grid");
    lastClickedItem = el;

    galleryGrid.classList.add("modal-mode");

    requestAnimationFrame(() => {
        el.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    modalMode = true;
    showCloseButton();
}

function showCloseButton() {
    header.classList.add("modal-mode");

    let btn = document.createElement("button");
    btn.innerText = "◄";
    btn.className = "gallery-modal-close";
    btn.onclick = closeGalleryModal;

    header.appendChild(btn);
}

function closeGalleryModal() {
    galleryGrid.classList.remove("modal-mode");
    header.classList.remove("modal-mode");

    document.querySelector(".gallery-modal-close")?.remove();
    modalMode = false;

    requestAnimationFrame(() => {
        lastClickedItem.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}