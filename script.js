gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

window.addEventListener("DOMContentLoaded", () => {
  // Hero Entrance Animation
  const heroTl = gsap.timeline();
  
  heroTl.from(".hero-subtitle", {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  })
  .from(".hero-title", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  }, "-=0.6")
  .from(".hero-description", {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8");

  // Navigation Logic
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".sidebar-link");

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateNav(index),
      onEnterBack: () => updateNav(index)
    });
  });

  function updateNav(index) {
    navLinks.forEach(link => link.classList.remove("active"));
    if (navLinks[index]) {
      navLinks[index].classList.add("active");
    }
  }

  // Smooth Scroll for Sidebar Links
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("data-section");
      if (targetId) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: `#${targetId}`,
            autoKill: false
          },
          ease: "power4.inOut"
        });
      }
    });
  });
});
