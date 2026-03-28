// SWITCHER POPUP
const switcherDetails = document.querySelector('.switcher-details');
const langToggle = document.querySelector('.lang-toggle-input');
const langSwitcher = document.querySelector('.lang-switcher');
if (switcherDetails) {
    if (window.innerWidth < 640) switcherDetails.open = false;
    window.matchMedia('(max-width: 640px)').addEventListener('change', (e) => {
        if (!e.matches) switcherDetails.open = true;
    });
    document.addEventListener('click', (e) => {
        if (switcherDetails.open && !switcherDetails.contains(e.target)) {
            if (window.innerWidth < 640) switcherDetails.open = false;
        }
        if (langToggle?.checked && !langSwitcher?.contains(e.target)) {
            langToggle.checked = false;
        }
    });
}

// SECTION-LEVEL VIDEO SOURCE LOADER
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.querySelectorAll('source[data-src]').forEach(source => {
            const video = source.parentElement;
            if (entry.isIntersecting) {
                if (!source.getAttribute('src')) {
                    source.src = source.dataset.src;
                    video.load();
                }
            } 
        });
    });
}, { rootMargin: '200px 0px 200px 0px', threshold: 0 });
document.querySelectorAll('.gallery-section').forEach(s => sectionObserver.observe(s));

// SCROLL EFFECTS
const fadeInObserver = new IntersectionObserver(observerAction, {root: null, rootMargin: "-40px 0px 0px 0px", threshold: 0});
const emphasizeObserver = new IntersectionObserver(observerAction, {root: null, rootMargin: "-20% 0px -30% 0px", threshold: .8});

let observeTargets = [];
observeTargets = [...observeTargets, ...document.querySelectorAll(".scroll-fade")];
observeTargets = [...observeTargets, ...document.querySelectorAll("section")];
observeTargets = [...observeTargets, ...document.querySelectorAll("h2")];
observeTargets.forEach(e => fadeInObserver.observe(e));

observeTargets = [];
observeTargets = [...observeTargets, ...document.querySelectorAll(".link-emphasize")];
observeTargets.forEach(e => emphasizeObserver.observe(e));

function observerAction(els){
    els.forEach((el) => {
        if(el.isIntersecting){
            el.target.classList.add("show");
        } else {
            el.target.classList.remove("show");
        }
    })
}

// THEME PERSISTENCE
function applyThemeToPictures(theme) {
    document.querySelectorAll('picture source').forEach(source => {
        if (theme === 'dark') source.media = 'all';
        else if (theme === 'light') source.media = 'not all';
        else source.media = '(prefers-color-scheme: dark)';
    });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    const radio = document.querySelector(`#theme [value="${savedTheme}"]`);
    if (radio) radio.checked = true;
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeToPictures(savedTheme);
}
document.querySelectorAll('#theme input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
        localStorage.setItem('theme', input.value);
        document.documentElement.setAttribute('data-theme', input.value);
        applyThemeToPictures(input.value);
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

// IG MODAL MODE
let header;
let langSwitch;
let nav;
let modalMode = false;
let galleryGrid;
let lastClickedItem;
function openGalleryModal(el) {
    if (window.innerWidth >= 640) return;
    if(modalMode) return
    galleryGrid = el.closest(".gallery-items");
    lastClickedItem = el;

    langSwitch = document.querySelector(".language-switcher")
    nav = document.querySelector(".site-header-inner")

    galleryGrid.classList.add("modal-mode");
    langSwitch.classList.add("modal-mode");
    nav.classList.add("modal-mode");

    const activeSection = galleryGrid.closest(".gallery-section");
    document.querySelectorAll(".template-content > *").forEach(el => {
        if (!el.contains(activeSection)) el.classList.add("modal-hidden");
    });

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
    let btn = document.createElement("button");
    btn.innerText = "◄";
    btn.className = "gallery-modal-close";
    btn.onclick = closeGalleryModal;

    nav.appendChild(btn);
}

function closeGalleryModal() {
    galleryGrid.classList.remove("modal-mode");
    langSwitch.classList.remove("modal-mode");
    nav.classList.remove("modal-mode");

    document.querySelectorAll(".modal-hidden").forEach(el => el.classList.remove("modal-hidden"));
    document.querySelector(".gallery-modal-close")?.remove();
    modalMode = false;

    requestAnimationFrame(() => {
        lastClickedItem.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

// INFINITE CAROUSEL
function initCarousels() {
    const DEFAULT_SPEED = 90; 
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.infinite-carousel').forEach(track => {
        const SPEED = parseFloat(track.dataset.speed) || DEFAULT_SPEED;
        const isLeft  = track.classList.contains('slide-left');
        const isRight = track.classList.contains('slide-right');
        if (!isLeft && !isRight) return;

        const inner = track.firstElementChild;
        const originalWidth = inner.scrollWidth;
        [...inner.children].forEach(el => inner.appendChild(el.cloneNode(true)));

        let halfWidth = 0;
        let position  = 0;
        let paused    = false;
        let lastTime  = null;
        let hidden    = document.hidden;

        //
        function measure() {
            halfWidth = inner.scrollWidth - originalWidth;
        }

        function tick(ts) {
            if (!lastTime) lastTime = ts;
            const delta = ts - lastTime;
            lastTime = ts;

            if (!paused && !hidden && halfWidth > 0) {
                const step = (SPEED * delta) / 1000;
                if (isLeft) {
                    position -= step;
                    if (position <= -halfWidth) position += halfWidth;
                } else {
                    position += step;
                    if (position >= 0) position -= halfWidth;
                }
                track.firstElementChild.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(tick);
        }

        function pause()  { paused = true; }
        function resume() { paused = false; lastTime = null; }

        //
        const container = track.closest('.gallery-section');
        if (container && window.matchMedia('(hover: hover)').matches) {
            container.addEventListener('mouseenter', pause,  { passive: true });
            container.addEventListener('mouseleave', resume, { passive: true });
        }

        document.addEventListener('visibilitychange', () => {
            hidden = document.hidden;
            if (!hidden) lastTime = null;
        });

        new ResizeObserver(measure).observe(container || track.parentElement);
        measure();

        if (prefersReduced) {
            track.firstElementChild.style.transform = `translateX(${-halfWidth / 2}px)`;
            return;
        }
        if (isRight) position = -halfWidth;
        requestAnimationFrame(tick);
    });
}
initCarousels();