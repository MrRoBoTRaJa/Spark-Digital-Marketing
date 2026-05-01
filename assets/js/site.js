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

const defaultServiceCards = [
  ["Website Development", "Business websites, landing pages, service pages, and responsive layouts designed to make your brand look trusted and easy to contact.", "Responsive website design\nLanding page and contact setup\nSEO-ready page structure", "Enquire Now"],
  ["App Development", "Android app planning, design support, promotion, installs, and launch guidance for businesses that want a stronger mobile presence.", "App idea and screen planning\nUI design support\nLaunch and promotion guidance", "Enquire Now"],
  ["Digital Marketing", "Social media marketing, paid ads, promotional campaigns, lead generation, audience research, and practical growth strategy.", "Social media campaigns\nLead generation ads\nAudience and competitor research", "Enquire Now"],
  ["SMM Panel", "Dashboard style panel for Instagram, YouTube, Facebook, Telegram, website traffic, reseller enquiries, and quick order requests.", "Service list with pricing\nNew order request form\nSaved order history", "Open Panel"],
  ["Website Maintenance", "Regular updates, speed checks, content changes, security basics, and technical care so your website keeps working smoothly.", "Content and image updates\nSpeed and mobile checks\nBasic backup and support", "Enquire Now"],
  ["Graphic Design", "Post creatives, banners, ad designs, brand visuals, and campaign artwork that make your online presence more attractive.", "Social media post design\nBanner and ad creatives\nBrand and campaign artwork", "Enquire Now"],
  ["Domain & Hosting", "Domain setup, hosting guidance, business email support, and basic website launch assistance from one place.", "Domain booking support\nHosting and SSL guidance\nBusiness email setup", "Enquire Now"],
  ["Panels", "Custom admin panels, customer request panels, and simple dashboards for managing business work, enquiries, orders, and service updates.", "Admin and customer panels\nRequest and order tracking\nDashboard layout planning", "Enquire Now"],
  ["Online Services", "Fast support for common online work, applications, registrations, digital forms, account setup, and customer service tasks.", "Government and private online forms\nBusiness, education, and job support\nDocument upload and digital assistance", "Enquire Now"]
];

const defaultPriceCards = [
  ["Website", "Landing Page", "Rs. 2,999", "Single page business website with mobile friendly layout and contact buttons.", "Ask Price"],
  ["Website", "Business Website", "Rs. 6,999", "Multi-page website for services, about, contact, gallery, and basic SEO setup.", "Ask Price"],
  ["Panel", "Admin Panel", "Rs. 9,999", "Simple panel for enquiries, service requests, order status, and data export.", "Ask Price"],
  ["App", "App Planning", "Rs. 4,999", "App idea planning, screen flow, launch guidance, and promotion support.", "Ask Price"],
  ["Marketing", "Social Media Package", "Rs. 4,999/mo", "Post planning, creatives, page support, and basic promotion guidance.", "Ask Price"],
  ["Marketing", "SEO / Local SEO", "Rs. 5,999/mo", "Keyword focus, Google Business Profile support, local ranking basics, and reports.", "Ask Price"],
  ["SMM Panel", "Social Boost Services", "Rs. 29 / 1K", "Starting price for selected SMM services. Final rate depends on platform and quality.", "Open Panel"],
  ["Ads", "Ad Campaign Setup", "Rs. 2,999", "Facebook, Instagram, or Google ad setup support. Ad budget is extra.", "Ask Price"],
  ["Maintenance", "Website Maintenance", "Rs. 1,999/mo", "Content updates, small fixes, mobile checks, and basic website care.", "Ask Price"],
  ["Design", "Social Media Post", "Rs. 199", "Single creative post design for business, festival, offer, or promotion.", "Ask Price"],
  ["Design", "Banner / Flyer", "Rs. 499", "Promotional banner, poster, flyer, or campaign artwork design.", "Ask Price"],
  ["Domain", "Domain & Hosting Setup", "Rs. 1,499", "Domain connection, hosting guidance, SSL basics, and launch support. Provider charges extra.", "Ask Price"],
  ["Online", "Online Form Help", "Rs. 99", "PAN, admission, job, certificate, bill payment, document upload, and similar online support.", "Ask Price"]
];

const defaultSmmServices = [
  ["Instagram", "Followers", "Rs. 149 / 1K", "100", "Normal"],
  ["Instagram", "Likes", "Rs. 49 / 1K", "100", "Fast"],
  ["Instagram", "Reel Views", "Rs. 29 / 1K", "500", "Fast"],
  ["Instagram", "Comments", "Rs. 399 / 1K", "50", "Normal"],
  ["YouTube", "Views", "Rs. 99 / 1K", "500", "Normal"],
  ["YouTube", "Subscribers", "Rs. 599 / 1K", "100", "Slow"],
  ["YouTube", "Watch Time", "Rs. 1,499 / 1K hours", "100 hours", "Slow"],
  ["YouTube", "Likes", "Rs. 149 / 1K", "100", "Normal"],
  ["Facebook", "Page Likes", "Rs. 249 / 1K", "100", "Normal"],
  ["Facebook", "Post Shares", "Rs. 299 / 1K", "100", "Normal"],
  ["Telegram", "Members", "Rs. 199 / 1K", "100", "Normal"],
  ["X / Twitter", "Followers", "Rs. 499 / 1K", "100", "Normal"],
  ["X / Twitter", "Retweets", "Rs. 249 / 1K", "100", "Normal"],
  ["TikTok", "Views", "Rs. 49 / 1K", "500", "Fast"],
  ["TikTok", "Followers", "Rs. 399 / 1K", "100", "Normal"],
  ["LinkedIn", "Followers", "Rs. 699 / 1K", "100", "Slow"],
  ["Pinterest", "Saves / Pins", "Rs. 199 / 1K", "100", "Normal"],
  ["Snapchat", "Story Views", "Rs. 199 / 1K", "500", "Normal"],
  ["Website", "Traffic", "Rs. 149 / 1K", "500", "Normal"],
  ["Reseller", "White Label Panel", "Rs. 14,999", "1 setup", "Custom"],
  ["Reseller", "API Access Enquiry", "Custom", "1 account", "Custom"]
];

const makeIndexedDefaults = (prefix, rows, fields) => rows.reduce((result, row, rowIndex) => {
  fields.forEach((field, fieldIndex) => {
    result[`${prefix}${rowIndex + 1}${field}`] = row[fieldIndex];
  });
  return result;
}, {});

const defaultSiteSettings = {
  heroEyebrow: "Digital Marketing Company In Ranchi Jharkhand",
  heroLine1: "Add spark",
  heroLine2: "to your Business",
  heroLead: "Your trusted source for SMM, SEO, promotional services, advertising, website designing, online services, and affordable digital growth plans.",
  homeTrustedKicker: "Trusted services for growing brands",
  homeIntroKicker: "Creative digital team at your service",
  homeIntroTitle: "We add spark to your business with practical online growth.",
  homeIntroText: "We help businesses grow through social media marketing, search engine optimization, paid ads, website designing, promotional campaigns, online services, and strong online visibility.",
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
  footerTagline: "Add spark to your Business.",
  aboutKicker: "About Us",
  aboutTitle: "Creative digital team at your service.",
  aboutLead: "We add spark to your business with practical online growth, clean design, and digital promotion support.",
  servicesKicker: "All Services",
  servicesTitle: "Complete online services for your business growth.",
  servicesLead: "Choose any service, check starting price, and send a direct enquiry on WhatsApp.",
  panelsKicker: "Panels",
  panelsTitle: "Simple business panels to manage work faster.",
  panelsLead: "We create clean admin panels, customer request panels, service dashboards, and internal tools for businesses that want organized digital work.",
  dashboardKicker: "SMM Panel",
  dashboardTitle: "Social media service dashboard for quick orders.",
  dashboardLead: "Choose a service, enter your profile or post link, add quantity, then send the request with payment screenshot on WhatsApp.",
  resultsKicker: "Results",
  resultsTitle: "Clear process, better visibility, stronger response.",
  resultsLead: "We focus on practical improvements that help people find, trust, and contact your business.",
  contactKicker: "Contact Us",
  contactTitle: "Tell us what you want to promote or complete online.",
  contactLead: "Call, WhatsApp, email, or submit your details. We will contact you with the right plan.",
  loginKicker: "Account Access",
  loginTitle: "Login to your dashboard.",
  loginLead: "User login opens SMM order dashboard. Admin login opens the full admin console.",
  adminKicker: "Admin Console",
  adminTitle: "Customer and panel requests.",
  adminLead: "Requests submitted from online service forms and SMM panel forms appear here on this browser. Export CSV regularly for backup.",
  onlineServicesKicker: "Online Services",
  onlineServicesTitle: "All common online work from one place.",
  onlineServicesLead: "We help with online forms, applications, document upload, payments, profiles, and digital support work.",
  websiteDevelopmentKicker: "Website Development",
  websiteDevelopmentTitle: "Clean website for your business.",
  websiteDevelopmentLead: "We make responsive websites that look professional, explain your services clearly, and help customers contact you easily.",
  appDevelopmentKicker: "App Development",
  appDevelopmentTitle: "Mobile app support for your idea.",
  appDevelopmentLead: "We help you plan, design, and promote a simple business app with clear screens and useful features.",
  digitalMarketingKicker: "Digital Marketing",
  digitalMarketingTitle: "Promotion that reaches the right people.",
  digitalMarketingLead: "We plan simple and practical campaigns for awareness, enquiries, followers, and business growth.",
  websiteMaintenanceKicker: "Website Maintenance",
  websiteMaintenanceTitle: "Keep your website fresh and working.",
  websiteMaintenanceLead: "We update your website content, check basic issues, and keep important information correct.",
  graphicDesignKicker: "Graphic Design",
  graphicDesignTitle: "Creative design for your brand.",
  graphicDesignLead: "We design clean and attractive visuals for social media, ads, banners, and business promotion.",
  domainHostingKicker: "Domain & Hosting",
  domainHostingTitle: "Setup support for your website launch.",
  domainHostingLead: "We help with domain, hosting, SSL, business email, and basic website launch requirements.",
  ...makeIndexedDefaults("serviceCard", defaultServiceCards, ["Title", "Text", "Points", "Button"]),
  ...makeIndexedDefaults("priceCard", defaultPriceCards, ["Tag", "Title", "Amount", "Text", "Button"]),
  ...makeIndexedDefaults("smmService", defaultSmmServices, ["Category", "Name", "Price", "Minimum", "Delivery"])
};

const getSiteSettings = () => ({
  ...defaultSiteSettings,
  ...remoteSiteSettings,
  ...JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY) || "{}")
});

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

const applySiteSettings = () => {
  const settings = getSiteSettings();
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  const listItemsFromText = (text) => String(text || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const pageName = (window.location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
  const pageHeroKeys = {
    about: "about",
    services: "services",
    panels: "panels",
    results: "results",
    contact: "contact",
    login: "login",
    admin: "admin",
    "online-services": "onlineServices",
    "website-development": "websiteDevelopment",
    "app-development": "appDevelopment",
    "digital-marketing": "digitalMarketing",
    "website-maintenance": "websiteMaintenance",
    "graphic-design": "graphicDesign",
    "domain-hosting": "domainHosting"
  };
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
  setText(".trusted-section > .section-kicker", settings.homeTrustedKicker);
  setText(".intro-content .section-kicker", settings.homeIntroKicker);
  setText(".intro-content h2", settings.homeIntroTitle);
  setText(".intro-content p:not(.section-kicker)", settings.homeIntroText);

  const pageKey = pageHeroKeys[pageName];
  if (pageKey) {
    setText(".page-hero .section-kicker", settings[`${pageKey}Kicker`]);
    setText(".page-hero h1", settings[`${pageKey}Title`]);
    setText(".page-hero p:not(.section-kicker)", settings[`${pageKey}Lead`]);
  }

  if (pageName === "dashboard") {
    setText(".dashboard-hero .section-kicker", settings.dashboardKicker);
    setText(".dashboard-hero h1", settings.dashboardTitle);
    setText(".dashboard-hero p:not(.section-kicker)", settings.dashboardLead);
  }

  document.querySelectorAll(".service-card").forEach((card, index) => {
    const number = index + 1;
    setText(`#${card.id} h3`, settings[`serviceCard${number}Title`]);
    const text = card.querySelector("p");
    if (text) text.textContent = settings[`serviceCard${number}Text`];
    const points = card.querySelector(".service-points");
    if (points) {
      points.innerHTML = listItemsFromText(settings[`serviceCard${number}Points`]).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
    const button = card.querySelector(".service-btn");
    if (button) button.textContent = settings[`serviceCard${number}Button`];
  });

  document.querySelectorAll(".price-card").forEach((card, index) => {
    const number = index + 1;
    const tag = card.querySelector("span");
    const title = card.querySelector("h3");
    const amount = card.querySelector("strong");
    const text = card.querySelector("p");
    const button = card.querySelector("a");
    if (tag) tag.textContent = settings[`priceCard${number}Tag`];
    if (title) title.textContent = settings[`priceCard${number}Title`];
    if (amount) amount.textContent = settings[`priceCard${number}Amount`];
    if (text) text.textContent = settings[`priceCard${number}Text`];
    if (button) button.textContent = settings[`priceCard${number}Button`];
  });

  document.querySelectorAll(".services-table-section tbody tr").forEach((row, index) => {
    const number = index + 1;
    const cells = row.querySelectorAll("td");
    const values = [
      settings[`smmService${number}Category`],
      settings[`smmService${number}Name`],
      settings[`smmService${number}Price`],
      settings[`smmService${number}Minimum`],
      settings[`smmService${number}Delivery`]
    ];
    cells.forEach((cell, cellIndex) => {
      cell.textContent = values[cellIndex] || "";
    });
  });

  const smmServiceSelect = document.querySelector('select[name="smmService"]');
  if (smmServiceSelect) {
    const selectedValue = smmServiceSelect.value;
    const options = defaultSmmServices.map((_, index) => {
      const number = index + 1;
      const category = settings[`smmService${number}Category`];
      const name = settings[`smmService${number}Name`];
      return `${category} ${name}`.trim();
    }).filter(Boolean);
    smmServiceSelect.innerHTML = '<option value="">Choose service</option>' + options.map((option) =>
      `<option>${escapeHtml(option)}</option>`
    ).join("");
    if (options.includes(selectedValue)) {
      smmServiceSelect.value = selectedValue;
    }
  }

  const smmCategorySelect = document.querySelector('select[name="smmCategory"]');
  if (smmCategorySelect) {
    const selectedValue = smmCategorySelect.value;
    const categories = [...new Set(defaultSmmServices.map((_, index) =>
      settings[`smmService${index + 1}Category`]
    ).filter(Boolean))];
    smmCategorySelect.innerHTML = '<option value="">Choose category</option>' + categories.map((category) =>
      `<option>${escapeHtml(category)}</option>`
    ).join("");
    if (categories.includes(selectedValue)) {
      smmCategorySelect.value = selectedValue;
    }
  }

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
  const renderControlGroups = () => {
    const groupTargets = {
      serviceCards: {
        prefix: "serviceCard",
        rows: defaultServiceCards,
        title: "Service",
        fields: [
          ["Title", "Title", "input"],
          ["Text", "Description", "textarea"],
          ["Points", "Points, one per line", "textarea"],
          ["Button", "Button Text", "input"]
        ]
      },
      priceCards: {
        prefix: "priceCard",
        rows: defaultPriceCards,
        title: "Price",
        fields: [
          ["Tag", "Category", "input"],
          ["Title", "Service Name", "input"],
          ["Amount", "Amount", "input"],
          ["Text", "Description", "textarea"],
          ["Button", "Button Text", "input"]
        ]
      },
      smmServices: {
        prefix: "smmService",
        rows: defaultSmmServices,
        title: "SMM",
        fields: [
          ["Category", "Category", "input"],
          ["Name", "Service", "input"],
          ["Price", "Start Price", "input"],
          ["Minimum", "Minimum", "input"],
          ["Delivery", "Delivery", "input"]
        ]
      }
    };

    document.querySelectorAll("[data-control-group]").forEach((target) => {
      const config = groupTargets[target.dataset.controlGroup];
      if (!config || target.children.length) {
        return;
      }
      target.innerHTML = config.rows.map((row, index) => {
        const number = index + 1;
        const title = row[0] || `${config.title} ${number}`;
        const fields = config.fields.map(([key, label, type]) => {
          const name = `${config.prefix}${number}${key}`;
          const input = type === "textarea"
            ? `<textarea name="${name}"></textarea>`
            : `<input name="${name}" type="text">`;
          return `<label><span>${label}</span>${input}</label>`;
        }).join("");
        return `<div class="control-page-block control-edit-grid"><h3>${escapeHtml(config.title)} ${number}<small>${escapeHtml(title)}</small></h3>${fields}</div>`;
      }).join("");
    });
  };

  const fillControlForm = () => {
    const settings = getSiteSettings();
    Object.entries(settings).forEach(([key, value]) => {
      const field = siteControlForm.elements[key];
      if (field) {
        field.value = value;
      }
    });
  };

  renderControlGroups();
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
      controlMessage.textContent = "Website settings saved. Firebase will share it across devices when Firestore is enabled.";
    }
    showSuccessPopup("Website settings saved", "CONTROL-SAVED", "Your website settings have been updated.");
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
