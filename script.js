gsap && gsap.registerPlugin && gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

async function loadSidebar(path = 'sidebar.html', targetId = 'sidebar') {
  const container = document.getElementById(targetId);
  if (!container) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load sidebar');
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    console.error('loadSidebar:', err);
  }
}

function getSidebarSections() {
  return Array.from(document.querySelectorAll('.section, .overview-card')).filter(section => {
    const heading = section.querySelector('h1, h2, h3');
    return Boolean(heading);
  });
}

function buildSidebarNav() {
  const navList = document.querySelector('.sidebar-nav');
  const sections = getSidebarSections();

  if (!navList || sections.length === 0) return [];

  navList.innerHTML = '';

  sections.forEach((section, index) => {
    const heading = section.querySelector('h1, h2, h3');
    const button = document.createElement('button');
    button.className = 'sidebar-link';
    button.type = 'button';
    button.dataset.sectionIndex = String(index);
    button.dataset.section = section.id || '';
    button.textContent = heading.textContent.trim();

    if (index === 0) {
      button.classList.add('active');
    }

    navList.appendChild(document.createElement('li')).appendChild(button);
  });

  return sections;
}

function activateSidebarLink(navLinks, index) {
  navLinks.forEach(link => link.classList.remove('active'));
  if (navLinks[index]) {
    navLinks[index].classList.add('active');
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadSidebar();

  const sections = buildSidebarNav();
  const navLinks = document.querySelectorAll('.sidebar-link');


  if (document.querySelector(".hero-title")) {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".hero-subtitle", {
        y: 45,
        opacity: 0,
        scale: 0.98,
        duration: 1.1
      })
      .from(".hero-title", {
        y: 70,
        opacity: 0,
        scale: 0.96,
        duration: 1.4
      }, "-=0.6")
      .from(".hero-description", {
        y: 40,
        opacity: 0,
        duration: 1.1
      }, "-=0.8");
  }

  gsap.utils.toArray(".section:not(#hero)").forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 80,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out"
    });
  });

  gsap.utils.toArray(".impact-card, .overview-card").forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      ease: "power2.out"
    });
  });


  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => activateSidebarLink(navLinks, index),
      onEnterBack: () => activateSidebarLink(navLinks, index)
    });
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const sectionIndex = Number(link.dataset.sectionIndex);
      const target = sections[sectionIndex];

      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: target,
            autoKill: false
          },
          ease: "power4.inOut"
        });
      }
    });
  });

});
