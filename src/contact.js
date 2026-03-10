const form = document.querySelector(".contact-form");
if (!form) throw new Error("contact.js: .contact-form not found");

const button = form.querySelector("button");
const status = form.querySelector(".form-status");

const { errName, errEmailEmpty, errEmailInvalid, errMessage, sent, statusSuccess, statusError } = form.dataset;

const showError = (field, message) => {
    const wrapper = field.closest(".field");
    wrapper.classList.add("error");

    const errorId = `${field.id}-error`;
    const error = document.createElement("div");
    error.id = errorId;
    error.className = "field-error-message";
    error.setAttribute("role", "alert");
    error.textContent = message;

    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorId);

    wrapper.appendChild(error);
};

const clearFieldError = (field) => {
    const wrapper = field.closest(".field");
    wrapper.classList.remove("error");
    wrapper.querySelectorAll(".field-error-message").forEach(el => el.remove());
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
};

const validateField = (field) => {
    clearFieldError(field);
    if (!field.value.trim()) {
        if (field.id === "email") showError(field, errEmailEmpty);
        else if (field.id === "name") showError(field, errName);
        else showError(field, errMessage);
    } else if (field.id === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
        showError(field, errEmailInvalid);
    }
};

const clearErrors = () => {
    form.querySelectorAll(".field").forEach(wrapper => {
        wrapper.classList.remove("error");
    });
    form.querySelectorAll(".field-error-message").forEach(el => el.remove());
    [form.elements.name, form.elements.email, form.elements.message].forEach(field => {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
    });
};

// Real-time: clear error as user types, validate when leaving a field
[form.elements.name, form.elements.email, form.elements.message].forEach(field => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("blur", () => {
        if (field.value.trim() !== "" || field.closest(".field").classList.contains("error")) {
            validateField(field);
        }
    });
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearErrors();
    status.classList.remove("visible");
    status.textContent = "";

    let valid = true;
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;

    if (!name.value.trim()) { showError(name, errName); valid = false; }

    if (!email.value.trim()) {
        showError(email, errEmailEmpty); valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        showError(email, errEmailInvalid); valid = false;
    }

    if (!message.value.trim()) { showError(message, errMessage); valid = false; }

    if (!valid) {
        const firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // Honeypot
    if (form._gotcha?.value) return;

    button.disabled = true;

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        button.setAttribute("data-sent-label", sent);
        button.setAttribute("aria-label", sent);
        button.classList.add("sent");
        status.textContent = statusSuccess;
        status.classList.add("visible");

        form.reset();
        clearErrors();

        setTimeout(() => {
            button.classList.remove("sent");
            button.removeAttribute("data-sent-label");
            button.removeAttribute("aria-label");
            button.disabled = false;
            status.classList.remove("visible");
            status.textContent = "";
        }, 4000);

    } catch {
        button.disabled = false;
        status.textContent = statusError;
        status.classList.add("visible");
    }
});
