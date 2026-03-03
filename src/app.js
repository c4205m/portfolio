const observer = new IntersectionObserver((els) => {
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
}, {
    root: null,
    rootMargin: "-300px 0px 0px 0px",
    threshold: 0
});

let observeTargets = [];
// observeTargets = [...observeTargets, ...document.querySelectorAll("li")];
observeTargets = [...observeTargets, ...document.querySelectorAll("section")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".img-title")];
observeTargets = [...observeTargets, ...document.querySelectorAll(".gallery-item")];
observeTargets = [...observeTargets, ...document.querySelectorAll("video")];
observeTargets.forEach(e => observer.observe(e));