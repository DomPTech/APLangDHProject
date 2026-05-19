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

function initComparisons() {
  var x, i;
  /* Find all elements with an "overlay" class: */
  x = document.getElementsByClassName("img-comp-overlay");
  for (i = 0; i < x.length; i++) {
    /* Once for each "overlay" element:
    pass the "overlay" element as a parameter when executing the compareImages function: */
    compareImages(x[i]);
  }
  function compareImages(img) {
    var slider, clicked = 0, w, h;
    /* Use the parent container to compute sizes so it's responsive */
    function recalc() {
      w = img.parentElement.offsetWidth;
      h = img.parentElement.offsetHeight;
      
      const allImgs = img.parentElement.querySelectorAll(".img-comp-img img");
      allImgs.forEach(i => i.style.width = w + "px");

      /* Set the width of the overlay img to 50% of container: */
      img.style.width = (w / 2) + "px";
      if (slider) slider.style.left = (w / 2) + "px";
    }

    /* Create slider: */
    slider = document.createElement("DIV");
    slider.setAttribute("class", "img-comp-slider");
    /* Insert slider */
    img.parentElement.insertBefore(slider, img);
    /* Initial calc and position the slider in the middle: */
    recalc();
    /* Recalculate on window resize so the slider stays centered */
    window.addEventListener('resize', recalc);
    /* Execute a function when the mouse button is pressed: */
    slider.addEventListener("mousedown", slideReady);
    /* And another function when the mouse button is released: */
    window.addEventListener("mouseup", slideFinish);
    /* Or touched (for touch screens): */
    slider.addEventListener("touchstart", slideReady);
    /* And released (for touch screens): */
    window.addEventListener("touchend", slideFinish);
    function slideReady(e) {
      /* Prevent any other actions that may occur when moving over the image: */
      e.preventDefault();
      /* The slider is now clicked and ready to move: */
      clicked = 1;
      /* Execute a function when the slider is moved: */
      window.addEventListener("mousemove", slideMove);
      window.addEventListener("touchmove", slideMove);
    }
    function slideFinish() {
      /* The slider is no longer clicked: */
      clicked = 0;
    }
    function slideMove(e) {
      var pos, w;
      /* If the slider is no longer clicked, exit this function: */
      if (clicked == 0) return false;
      w = img.parentElement.offsetWidth;
      /* Get the cursor's x position: */
      pos = getCursorPos(e);
      /* Prevent the slider from being positioned outside the image: */
      if (pos < 0) pos = 0;
      if (pos > w) pos = w;
      /* Execute a function that will resize the overlay image according to the cursor: */
      slide(pos);
    }
    function getCursorPos(e) {
      var a, x = 0;
      e = (e.changedTouches) ? e.changedTouches[0] : e;
      /* Get the x positions of the image parent: */
      a = img.parentElement.getBoundingClientRect();
      /* Calculate the cursor's x coordinate, relative to the image: */
      x = e.clientX - a.left;
      return x;
    }
    function slide(x) {
      /* Resize the image: */
      img.style.width = x + "px";
      /* Position the slider: */
      slider.style.left = img.offsetWidth + "px";
    }
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadSidebar();

  const sections = buildSidebarNav();
  const navLinks = document.querySelectorAll('.sidebar-link');

  // Initialize the Before/After slider
  initComparisons();

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

  // Dynamic style shift from rustic to modern
  const tvaArrivalSection = document.getElementById("tva-arrival");
  if (tvaArrivalSection) {
    ScrollTrigger.create({
      trigger: tvaArrivalSection,
      start: "top center", // when the top of the TVA section hits the center of the viewport
      onEnter: () => {
        document.body.classList.remove("era-rustic");
        document.body.classList.add("era-modern");
      },
      onLeaveBack: () => {
        document.body.classList.remove("era-modern");
        document.body.classList.add("era-rustic");
      }
    });
  }

});
