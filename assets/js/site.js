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
const adminSearchId = document.querySelector(".admin-search-id");
const adminSearchName = document.querySelector(".admin-search-name");
const adminSearchPhone = document.querySelector(".admin-search-phone");
const adminSearchButton = document.querySelector(".admin-search-btn");
const adminResetButton = document.querySelector(".admin-reset-btn");
const adminExport = document.querySelector(".admin-export");
const adminEmpty = document.querySelector(".admin-empty");
const adminSmmEmpty = document.querySelector(".admin-smm-empty");
const smmOrderForm = document.querySelector(".smm-order-form");
const smmMessage = document.querySelector(".smm-message");
const smmOrders = document.querySelector(".smm-orders");
const smmEmpty = document.querySelector(".smm-empty");
const siteControlForm = document.querySelector(".site-control-form");
const controlMessage = document.querySelector(".control-message");
const controlReset = document.querySelector(".control-reset");
const ORDER_KEY = "sparkServiceRequests";
const SMM_ORDER_KEY = "sparkSmmOrders";
const SITE_SETTINGS_KEY = "sparkSiteSettings";
const ADMIN_AUTH_KEY = "sparkAdminLoggedIn";
const USER_AUTH_KEY = "sparkUserLoggedIn";
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "Spark@123";
const USER_ID = "user";
const USER_PASSWORD = "User@123";
const sparkDbReady = import("./firebase-db.js").then((module) => module.sparkDB).catch(() => null);
let remoteServiceOrders = [];
let remoteSmmOrders = [];
let remoteSiteSettings = {};
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

const defaultSiteSettings = {
  heroEyebrow: "Digital Marketing Company In Ranchi Jharkhand",
  heroLine1: "Add spark",
  heroLine2: "to your Business",
  heroLead: "Your trusted source for SMM, SEO, promotional services, advertising, website designing, online services, and affordable digital growth plans.",
  promoEnabled: "yes",
  promoTag: "Trending Service",
  promoTitle: "Social Media Campaign",
  promoText: "Facebook and Instagram promotion, creative posts, lead generation ads, offer campaigns, and audience targeting for your business.",
  promoButtonText: "View Details",
  promoButtonLink: "digital-marketing.html",
  email: "sparkdigitalmkt1@gmail.com",
  phone1: "+91 9113373565",
  phone2: "+91 8227028000",
  whatsapp: "919113373565",
  address: "Opp Smart Bazar, Mainroad, Ranchi - 834001 Jharkhand",
  footerTagline: "Add spark to your Business."
};

const getSiteSettings = () => ({
  ...defaultSiteSettings,
  ...remoteSiteSettings,
  ...JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY) || "{}")
});

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

const applySiteSettings = () => {
  const settings = getSiteSettings();
  const heroEyebrow = document.querySelector(".hero-copy .eyebrow");
  const heroLine1 = document.querySelector(".hero-copy h1 span:first-child");
  const heroLine2 = document.querySelector(".hero-copy h1 span:last-child");
  const heroLead = document.querySelector(".hero-lead");
  const promoPopupEl = document.querySelector(".promo-popup");
  const promoTag = document.querySelector(".promo-tag");
  const promoTitle = document.querySelector("#promo-title");
  const promoText = document.querySelector(".promo-copy p:not(.promo-tag)");
  const promoButton = document.querySelector(".promo-banner .primary-btn");

  if (heroEyebrow) heroEyebrow.textContent = settings.heroEyebrow;
  if (heroLine1) heroLine1.textContent = settings.heroLine1;
  if (heroLine2) heroLine2.textContent = settings.heroLine2;
  if (heroLead) heroLead.textContent = settings.heroLead;
  if (promoTag) promoTag.textContent = settings.promoTag;
  if (promoTitle) promoTitle.textContent = settings.promoTitle;
  if (promoText) promoText.textContent = settings.promoText;
  if (promoButton) {
    promoButton.textContent = settings.promoButtonText;
    promoButton.href = settings.promoButtonLink;
  }
  if (promoPopupEl && settings.promoEnabled === "no") {
    promoPopupEl.classList.remove("is-visible");
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.href = `mailto:${settings.email}`;
    link.textContent = settings.email;
  });

  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  const phones = [settings.phone1, settings.phone2];
  phoneLinks.forEach((link, index) => {
    const phone = phones[index] || settings.phone1;
    link.href = `tel:${digitsOnly(phone)}`;
    link.textContent = phone;
  });

  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${digitsOnly(settings.whatsapp)}`);
  });

  document.querySelectorAll(".whatsapp-float").forEach((link) => {
    link.href = `https://wa.me/${digitsOnly(settings.whatsapp)}`;
  });

  document.querySelectorAll(".footer-brand p").forEach((tagline) => {
    tagline.textContent = settings.footerTagline;
  });

  document.querySelectorAll(".site-footer div:last-of-type span").forEach((address) => {
    address.textContent = settings.address;
  });
};

applySiteSettings();

sparkDbReady.then(async (db) => {
  if (!db?.enabled) {
    return;
  }
  try {
    const settings = await db.getSiteSettings();
    if (settings) {
      remoteSiteSettings = settings;
      applySiteSettings();
      if (siteControlForm) {
        Object.entries(getSiteSettings()).forEach(([key, value]) => {
          const field = siteControlForm.elements[key];
          if (field) field.value = value;
        });
      }
    }
  } catch (error) {
    console.warn("Firebase settings unavailable", error);
  }
});

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
    sparkDbReady.then((db) => db?.saveServiceRequest(order)).catch(() => {});
    purchaseMessage.textContent = `Request saved. Your request ID is ${requestId}.`;
    purchaseForm.reset();
    showSuccessPopup("Thank you for your request", requestId, "Your request has been saved. Keep this ID for follow-up.");
  });
}

const mergeById = (localRows, remoteRows) => {
  const merged = new Map();
  [...remoteRows, ...localRows].forEach((row) => {
    if (row?.id) {
      merged.set(row.id, row);
    }
  });
  return [...merged.values()];
};

const getServiceOrders = () => mergeById(JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"), remoteServiceOrders);
const getSmmOrders = () => mergeById(JSON.parse(localStorage.getItem(SMM_ORDER_KEY) || "[]"), remoteSmmOrders);

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

if (siteControlForm) {
  const fillControlForm = () => {
    const settings = getSiteSettings();
    Object.entries(settings).forEach(([key, value]) => {
      const field = siteControlForm.elements[key];
      if (field) {
        field.value = value;
      }
    });
  };

  fillControlForm();

  siteControlForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(siteControlForm);
    const settings = { ...defaultSiteSettings };
    Object.keys(settings).forEach((key) => {
      settings[key] = String(formData.get(key) || defaultSiteSettings[key]).trim();
    });
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
    sparkDbReady.then((db) => db?.saveSiteSettings(settings)).catch(() => {});
    applySiteSettings();
    if (controlMessage) {
      controlMessage.textContent = "Website settings saved in this browser.";
    }
    showSuccessPopup("Website settings saved", "CONTROL-SAVED", "Your common website settings have been updated on this browser.");
  });

  if (controlReset) {
    controlReset.addEventListener("click", () => {
      localStorage.removeItem(SITE_SETTINGS_KEY);
      fillControlForm();
      applySiteSettings();
      if (controlMessage) {
        controlMessage.textContent = "Website settings reset to default.";
      }
    });
  }
}

if (adminOrders || adminSmmOrders) {
  const getAdminFilters = () => ({
    all: (adminSearch?.value || "").trim().toLowerCase(),
    id: (adminSearchId?.value || "").trim().toLowerCase(),
    name: (adminSearchName?.value || "").trim().toLowerCase(),
    phone: (adminSearchPhone?.value || "").trim().toLowerCase()
  });

  const matchesAdminFilters = (order, filters) => {
    const allText = Object.values(order).join(" ").toLowerCase();
    const idText = String(order.id || "").toLowerCase();
    const nameText = String(order.name || "").toLowerCase();
    const phoneText = String(order.phone || "").toLowerCase();

    return (!filters.all || allText.includes(filters.all)) &&
      (!filters.id || idText.includes(filters.id)) &&
      (!filters.name || nameText.includes(filters.name)) &&
      (!filters.phone || phoneText.includes(filters.phone));
  };

  const renderOrders = () => {
    const filters = getAdminFilters();
    const orders = getServiceOrders().filter((order) =>
      matchesAdminFilters(order, filters)
    );
    const smmAdminOrders = getSmmOrders().filter((order) =>
      matchesAdminFilters(order, filters)
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

  sparkDbReady.then(async (db) => {
    if (!db?.enabled) {
      return;
    }
    try {
      const [serviceRows, smmRows] = await Promise.all([
        db.getServiceRequests(),
        db.getSmmOrders()
      ]);
      remoteServiceOrders = serviceRows;
      remoteSmmOrders = smmRows;
      renderOrders();
    } catch (error) {
      console.warn("Firebase orders unavailable", error);
    }
  });

  if (adminSearchButton) {
    adminSearchButton.addEventListener("click", renderOrders);
  }

  if (adminResetButton) {
    adminResetButton.addEventListener("click", () => {
      [adminSearch, adminSearchId, adminSearchName, adminSearchPhone].forEach((input) => {
        if (input) {
          input.value = "";
        }
      });
      renderOrders();
    });
  }

  [adminSearch, adminSearchId, adminSearchName, adminSearchPhone].forEach((input) => {
    if (input) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          renderOrders();
        }
      });
    }
  });

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
    sparkDbReady.then((db) => db?.saveSmmOrder(order)).catch(() => {});
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
