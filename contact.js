const form = document.querySelector(".contact-form");
console.log(form)
const button = form.querySelector("button");
const status = form.querySelector(".form-status");

const showError = (field, message) => {
    const wrapper = field.closest(".field");
    wrapper.classList.add("error");

    const error = document.createElement("div");
    error.className = "field-error-message";
    error.textContent = message;

    wrapper.appendChild(error);
};

const clearErrors = () => {
    form.querySelectorAll(".field").forEach(field => {
    field.classList.remove("error");
    });

    form.querySelectorAll(".field-error-message").forEach(el => el.remove());
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearErrors();
    status.classList.remove("visible");
    status.textContent = "";

    let valid = true;

    const name = form.name;
    const email = form.email;
    const message = form.message;

    if (!name.value.trim()) {
    showError(name, "Please enter your name.");
    valid = false;
    }

    if (!email.value.trim()) {
    showError(email, "Please enter your email.");
    valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    showError(email, "Please enter a valid email.");
    valid = false;
    }

    if (!message.value.trim()) {
    showError(message, "Please enter a message.");
    valid = false;
    }

    if (!valid) return;

    // Honeypot
    if (form._gotcha.value) return;

    button.disabled = true;

    const formData = new FormData(form);

    try {
    const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error();

    button.classList.add("sent");
    status.textContent = "Message delivered successfully.";
    status.classList.add("visible");

    form.reset();

    setTimeout(() => {
        button.classList.remove("sent");
        button.disabled = false;
        status.classList.remove("visible");
        status.textContent = "";
    }, 4000);

    } catch (error) {
    button.disabled = false;
    status.textContent = "Something went wrong. Please try again.";
    status.classList.add("visible");
    }
});