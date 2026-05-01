const CONTACT_EMAIL = "abigailparilla06@gmail.com";
const NAV_SCROLL_THRESHOLD = 60;
const REVEAL_THRESHOLD = 0.1;

function initializePortfolio() {
  initializeAnalyticsTracking();
  initializeContactForm();
  initializeRevealAnimations();
  initializeNavScrollState();
  initializeProjectCardGlow();
}

function initializeAnalyticsTracking() {
  document.addEventListener("click", (event) => {
    const trackableElement = event.target.closest("[data-event]");
    if (!trackableElement) {
      return;
    }

    const { event: eventName, label } = trackableElement.dataset;
    if (!eventName || typeof gtag !== "function") {
      return;
    }

    gtag("event", eventName, {
      event_category: eventName === "nav_click" ? "navigation" : "engagement",
      event_label: label,
      transport_type: "beacon",
    });
  });
}

function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = name ? `Portfolio inquiry from ${name}` : "Portfolio inquiry";
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const mailtoUrl =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.assign(mailtoUrl);
  });
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: REVEAL_THRESHOLD });

  revealElements.forEach((element) => observer.observe(element));
}

function initializeNavScrollState() {
  const navigation = document.querySelector("nav");
  if (!navigation) {
    return;
  }

  const updateNavigationState = () => {
    navigation.classList.toggle("scrolled", window.scrollY > NAV_SCROLL_THRESHOLD);
  };

  updateNavigationState();
  window.addEventListener("scroll", updateNavigationState, { passive: true });
}

function initializeProjectCardGlow() {
  let activeCard = null;

  document.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".project-card");

    if (!card) {
      if (activeCard) {
        activeCard.style.removeProperty("background");
        activeCard = null;
      }
      return;
    }

    if (activeCard && activeCard !== card) {
      activeCard.style.removeProperty("background");
    }

    activeCard = card;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    card.style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,45,120,0.07), rgba(255,255,255,0.02) 60%)`;
  });

  document.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) {
      return;
    }

    const nextCard = event.relatedTarget?.closest?.(".project-card") || null;
    if (card === nextCard) {
      return;
    }

    card.style.removeProperty("background");

    if (activeCard === card) {
      activeCard = nextCard;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio);
} else {
  initializePortfolio();
}