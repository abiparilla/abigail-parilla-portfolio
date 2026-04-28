window.addEventListener("load", () => {
  document.documentElement.classList.add("smooth");
});

document.querySelectorAll("[data-event]").forEach(element => {
  element.addEventListener("click", (e) => {
    const eventName = element.dataset.event;
    const label = element.dataset.label;

    gtag('event', eventName, {
      event_category: eventName === 'nav_click' ? 'navigation' : 'engagement',
      event_label: label,
      transport_type: 'beacon'
    });
  });
});

function changeTheme() {
    document.body.classList.toggle("dark-mode");
}