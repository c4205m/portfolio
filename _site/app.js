const observer = new IntersectionObserver(observerAction, {
    root: null,
    rootMargin: "-17% 0px 0px 0px",
    threshold: 0
});

const observer2 = new IntersectionObserver(observerAction, {
    root: null,
    rootMargin: "-17% 0px -50% 0px",
    threshold: 1
});

let observeTargets = [];
// observeTargets = [...observeTargets, ...document.querySelectorAll("li")];
observeTargets = [...observeTargets, ...document.querySelectorAll("section")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".img-title")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".gallery-item")];
observeTargets = [...observeTargets, ...document.querySelectorAll("video")];
observeTargets.forEach(e => observer.observe(e));

observeTargets = [];
observeTargets = [...observeTargets, ...document.querySelectorAll(".linkemph")];
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