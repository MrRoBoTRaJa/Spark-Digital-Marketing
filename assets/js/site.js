const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector(".newsletter-form");
const message = document.querySelector(".form-message");
const promoPopup = document.querySelector(".promo-popup");
const promoClose = document.querySelector(".promo-close");
const purchaseForm = document.querySelector(".purchase-form");
const purchaseMessage = document.querySelector(".purchase-message");
const adminOrders = document.querySelector(".admin-orders");
const adminSmmOrders = document.querySelector(".admin-smm-orders");
const adminLoginSection = document.querySelector(".admin-login-section");
const adminLoginForm = document.querySelector(".admin-login-form");
const adminLoginMessage = document.querySelector(".admin-login-message");
const adminSection = document.querySelector(".admin-section");
const userLoginSection = document.querySelector(".user-login-section");
const userLoginForm = document.querySelector(".user-login-form");
const userLoginMessage = document.querySelector(".user-login-message");
const dashboardShell = document.querySelector(".dashboard-shell");
const logoutButtons = document.querySelectorAll(".auth-logout");
const adminSearch = document.querySelector(".admin-search");
const adminExport = document.querySelector(".admin-export");
const adminEmpty = document.querySelector(".admin-empty");
const adminSmmEmpty = document.querySelector(".admin-smm-empty");
const smmOrderForm = document.querySelector(".smm-order-form");
const smmMessage = document.querySelector(".smm-message");
const smmOrders = document.querySelector(".smm-orders");
const smmEmpty = document.querySelector(".smm-empty");
const ORDER_KEY = "sparkServiceRequests";
const SMM_ORDER_KEY = "sparkSmmOrders";
const ADMIN_AUTH_KEY = "sparkAdminLoggedIn";
const USER_AUTH_KEY = "sparkUserLoggedIn";
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "Spark@123";
const USER_ID = "user";
const USER_PASSWORD = "User@123";
const makeRequestId = (prefix) => {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${Date.now().toString().slice(-5)}${random}`;
};
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));

const showSuccessPopup = (title, id, message) => {
  const popup = document.createElement("div");
  popup.className = "success-popup is-visible";
  popup.innerHTML = `
    <div class="success-card" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <button class="success-close" type="button" aria-label="Close success message">&times;</button>
      <p class="section-kicker">Submitted</p>
      <h2 id="success-title">${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
      <strong>${escapeHtml(id)}</strong>
      <button class="primary-btn success-ok" type="button">OK</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closePopup = () => popup.remove();
  popup.querySelector(".success-close").addEventListener("click", closePopup);
  popup.querySelector(".success-ok").addEventListener("click", closePopup);
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });
};

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
    const requestId = makeRequestId("REQ");
    const order = {
      id: requestId,
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
    purchaseMessage.textContent = `Request saved. Your request ID is ${requestId}.`;
    purchaseForm.reset();
    showSuccessPopup("Thank you for your request", requestId, "Your request has been saved. Keep this ID for follow-up.");
  });
}

const getServiceOrders = () => JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
const getSmmOrders = () => JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]");

const unlockAdmin = () => {
  if (adminLoginSection) {
    adminLoginSection.classList.add("is-hidden");
  }

  if (adminSection) {
    adminSection.classList.remove("is-locked");
  }
};

const unlockDashboard = () => {
  if (userLoginSection) {
    userLoginSection.classList.add("is-hidden");
  }

  if (dashboardShell) {
    dashboardShell.classList.remove("is-locked");
  }
};

if (adminLoginForm && adminLoginMessage) {
  if (sessionStorage.getItem(ADMIN_AUTH_KEY) === "true") {
    unlockAdmin();
  }

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminLoginForm);
    const user = String(formData.get("adminUser") || "").trim();
    const password = String(formData.get("adminPassword") || "");

    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      adminLoginMessage.textContent = "";
      adminLoginForm.reset();
      unlockAdmin();
      const target = adminLoginForm.dataset.loginTarget;
      if (target) {
        window.location.href = target;
      }
      return;
    }

    adminLoginMessage.textContent = "Wrong user ID or password.";
  });
}

if (userLoginForm && userLoginMessage) {
  if (sessionStorage.getItem(USER_AUTH_KEY) === "true" || sessionStorage.getItem(ADMIN_AUTH_KEY) === "true") {
    unlockDashboard();
  }

  userLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(userLoginForm);
    const user = String(formData.get("userId") || "").trim();
    const password = String(formData.get("userPassword") || "");

    if (user === USER_ID && password === USER_PASSWORD) {
      sessionStorage.setItem(USER_AUTH_KEY, "true");
      userLoginMessage.textContent = "";
      userLoginForm.reset();
      unlockDashboard();
      const target = userLoginForm.dataset.loginTarget;
      if (target) {
        window.location.href = target;
      }
      return;
    }

    userLoginMessage.textContent = "Wrong user ID or password.";
  });
}

logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(USER_AUTH_KEY);
    window.location.href = "login.html";
  });
});

if (adminOrders || adminSmmOrders) {
  const renderOrders = (filter = "") => {
    const query = filter.trim().toLowerCase();
    const orders = getServiceOrders().filter((order) =>
      Object.values(order).join(" ").toLowerCase().includes(query)
    );
    const smmAdminOrders = getSmmOrders().filter((order) =>
      Object.values(order).join(" ").toLowerCase().includes(query)
    );

    if (adminOrders) {
      adminOrders.innerHTML = orders.map((order) => `
        <tr>
          <td>${escapeHtml(order.id || "Old request")}</td>
          <td>${escapeHtml(order.date)}</td>
          <td>${escapeHtml(order.name)}</td>
          <td>${escapeHtml(order.phone)}</td>
          <td>${escapeHtml(order.service)}</td>
          <td>${escapeHtml(order.documents)}</td>
          <td>${escapeHtml(order.paymentMethod)}</td>
          <td>${escapeHtml(order.paymentStatus)}</td>
          <td>${escapeHtml(order.details)}</td>
        </tr>
      `).join("");
    }

    if (adminSmmOrders) {
      adminSmmOrders.innerHTML = smmAdminOrders.map((order) => `
        <tr>
          <td>${escapeHtml(order.id || "Old order")}</td>
          <td>${escapeHtml(order.date)}</td>
          <td>${escapeHtml(order.name)}</td>
          <td>${escapeHtml(order.phone)}</td>
          <td>${escapeHtml(order.category)}</td>
          <td>${escapeHtml(order.service)}</td>
          <td>${escapeHtml(order.quantity)}</td>
          <td>${escapeHtml(order.payment)}</td>
          <td><a href="${escapeHtml(order.link)}" target="_blank" rel="noopener">Open</a></td>
          <td>${escapeHtml(order.notes)}</td>
        </tr>
      `).join("");
    }

    if (adminEmpty) {
      adminEmpty.classList.toggle("is-visible", orders.length === 0);
    }

    if (adminSmmEmpty) {
      adminSmmEmpty.classList.toggle("is-visible", smmAdminOrders.length === 0);
    }
  };

  renderOrders();

  if (adminSearch) {
    adminSearch.addEventListener("input", () => renderOrders(adminSearch.value));
  }

  if (adminExport) {
    adminExport.addEventListener("click", () => {
      const orders = getServiceOrders();
      const smmAdminOrders = getSmmOrders();
      const serviceHeaders = ["Type", "Request ID", "Date", "Name", "Mobile", "Service", "Documents", "Payment Method", "Payment Status", "Details"];
      const smmHeaders = ["Type", "Order ID", "Date", "Name", "Mobile", "Category", "Service", "Quantity", "Payment", "Link", "Notes"];
      const serviceRows = orders.map((order) => [
        "Online Service",
        order.id || "Old request",
        order.date,
        order.name,
        order.phone,
        order.service,
        order.documents,
        order.paymentMethod,
        order.paymentStatus,
        order.details
      ]);
      const smmRows = smmAdminOrders.map((order) => [
        "SMM Panel",
        order.id || "Old order",
        order.date,
        order.name,
        order.phone,
        order.category,
        order.service,
        order.quantity,
        order.payment,
        order.link,
        order.notes
      ]);
      const csv = [serviceHeaders, ...serviceRows, [], smmHeaders, ...smmRows].map((row) =>
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

}

if (smmOrderForm && smmMessage) {
  smmOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(smmOrderForm);
    const orders = JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]");
    const orderId = makeRequestId("SMM");
    const order = {
      id: orderId,
      date: new Date().toLocaleString(),
      name: formData.get("smmName"),
      phone: formData.get("smmPhone"),
      category: formData.get("smmCategory"),
      service: formData.get("smmService"),
      link: formData.get("smmLink"),
      quantity: formData.get("smmQuantity"),
      payment: formData.get("smmPayment"),
      notes: formData.get("smmNotes") || "Not provided"
    };

    orders.unshift(order);
    localStorage.setItem(SMM_ORDER_KEY, JSON.stringify(orders));
    smmMessage.textContent = `SMM order saved. Your order ID is ${orderId}.`;
    smmOrderForm.reset();
    showSuccessPopup("Thank you for your order", orderId, "Your SMM order has been saved. Keep this ID for follow-up.");
    renderSmmOrders();
  });
}

const renderSmmOrders = () => {
  if (!smmOrders) {
    return;
  }

  const orders = JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]");
  smmOrders.innerHTML = orders.map((order) => `
    <tr>
      <td>${escapeHtml(order.id || "Old order")}</td>
      <td>${escapeHtml(order.date)}</td>
      <td>${escapeHtml(order.name)}</td>
      <td>${escapeHtml(order.phone)}</td>
      <td>${escapeHtml(order.category)} - ${escapeHtml(order.service)}</td>
      <td>${escapeHtml(order.quantity)}</td>
      <td>${escapeHtml(order.payment)}</td>
      <td><a href="${escapeHtml(order.link)}" target="_blank" rel="noopener">Open</a></td>
    </tr>
  `).join("");

  if (smmEmpty) {
    smmEmpty.classList.toggle("is-visible", orders.length === 0);
  }
};

renderSmmOrders();
