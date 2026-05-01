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
const adminSearch = document.querySelector(".admin-search");
const adminExport = document.querySelector(".admin-export");
const adminClear = document.querySelector(".admin-clear");
const adminEmpty = document.querySelector(".admin-empty");
const adminSmmEmpty = document.querySelector(".admin-smm-empty");
const smmOrderForm = document.querySelector(".smm-order-form");
const smmMessage = document.querySelector(".smm-message");
const smmOrders = document.querySelector(".smm-orders");
const smmEmpty = document.querySelector(".smm-empty");
const ORDER_KEY = "sparkServiceRequests";
const SMM_ORDER_KEY = "sparkSmmOrders";
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[char]));

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

const getServiceOrders = () => JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
const getSmmOrders = () => JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]");

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
      const serviceHeaders = ["Type", "Date", "Name", "Mobile", "Service", "Documents", "Payment Method", "Payment Status", "Details"];
      const smmHeaders = ["Type", "Date", "Name", "Mobile", "Category", "Service", "Quantity", "Payment", "Link", "Notes"];
      const serviceRows = orders.map((order) => [
        "Online Service",
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

  if (adminClear) {
    adminClear.addEventListener("click", () => {
      if (confirm("Clear all saved service and SMM panel requests?")) {
        localStorage.removeItem(ORDER_KEY);
        localStorage.removeItem(SMM_ORDER_KEY);
        renderOrders();
      }
    });
  }
}

if (smmOrderForm && smmMessage) {
  smmOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(smmOrderForm);
    const orders = JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]");
    const order = {
      id: Date.now(),
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
    smmMessage.textContent = "SMM order saved. Send payment screenshot and order details on WhatsApp.";
    smmOrderForm.reset();
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
