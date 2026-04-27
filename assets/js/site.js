const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector(".newsletter-form");
const message = document.querySelector(".form-message");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (form && message) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "Thanks for submitting. We will contact you at the earliest.";
    form.reset();
  });
}
