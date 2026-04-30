const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector(".newsletter-form");
const message = document.querySelector(".form-message");
const promoPopup = document.querySelector(".promo-popup");
const promoClose = document.querySelector(".promo-close");
const purchaseForm = document.querySelector(".purchase-form");
const purchaseMessage = document.querySelector(".purchase-message");
const adminOrders = document.querySelector(".admin-orders");
const adminSearch = document.querySelector(".admin-search");
const adminExport = document.querySelector(".admin-export");
const adminClear = document.querySelector(".admin-clear");
const adminEmpty = document.querySelector(".admin-empty");
const ORDER_KEY = "sparkServiceRequests";

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

if (promoPopup && promoClose) {
  const closePromo = () => {
    promoPopup.classList.remove("is-visible");
    window.clearTimeout(promoTimer);
  };

  let promoTimer = window.setTimeout(() => {
    closePromo();
  }, 5000);

  promoClose.addEventListener("click", closePromo);

  promoPopup.addEventListener("click", (event) => {
    if (event.target === promoPopup) {
      closePromo();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePromo();
    }
  });
}

if (purchaseForm && purchaseMessage) {
  purchaseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(purchaseForm);
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      name: formData.get("customerName"),
      phone: formData.get("customerPhone"),
      service: formData.get("serviceType"),
      documents: formData.get("documentStatus"),
      details: formData.get("serviceDetails") || "Not provided",
      paymentMethod: formData.get("paymentMethod"),
      paymentStatus: formData.get("paymentStatus")
    };

    orders.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    purchaseMessage.textContent = "Request saved. You can view it in Admin Console.";
    purchaseForm.reset();
  });
}

if (adminOrders) {
  const getOrders = () => JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");

  const renderOrders = (filter = "") => {
    const query = filter.trim().toLowerCase();
    const orders = getOrders().filter((order) =>
      Object.values(order).join(" ").toLowerCase().includes(query)
    );

    adminOrders.innerHTML = orders.map((order) => `
      <tr>
        <td>${order.date}</td>
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.service}</td>
        <td>${order.documents}</td>
        <td>${order.paymentMethod}</td>
        <td>${order.paymentStatus}</td>
        <td>${order.details}</td>
      </tr>
    `).join("");

    if (adminEmpty) {
      adminEmpty.classList.toggle("is-visible", orders.length === 0);
    }
  };

  renderOrders();

  if (adminSearch) {
    adminSearch.addEventListener("input", () => renderOrders(adminSearch.value));
  }

  if (adminExport) {
    adminExport.addEventListener("click", () => {
      const orders = getOrders();
      const headers = ["Date", "Name", "Mobile", "Service", "Documents", "Payment Method", "Payment Status", "Details"];
      const rows = orders.map((order) => [
        order.date,
        order.name,
        order.phone,
        order.service,
        order.documents,
        order.paymentMethod,
        order.paymentStatus,
        order.details
      ]);
      const csv = [headers, ...rows].map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "spark-service-requests.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  if (adminClear) {
    adminClear.addEventListener("click", () => {
      if (confirm("Clear all saved service requests?")) {
        localStorage.removeItem(ORDER_KEY);
        renderOrders();
      }
    });
  }
}
