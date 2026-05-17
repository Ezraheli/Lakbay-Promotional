(function () {
  const nav = document.getElementById("site-nav");
  const hero = document.getElementById("hero");
  const memory = document.getElementById("memory");
  const finale = document.getElementById("finale");
  const manifestoLines = document.querySelectorAll(".manifesto-line");
  const manifestoSection = document.getElementById("manifesto");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  // Mobile Menu Elements
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const burgerLines = mobileBtn ? mobileBtn.querySelectorAll("span") : [];
  let isMenuOpen = false;

  function updateScrollTopBtn() {
    if (!scrollTopBtn) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    const vh = window.innerHeight;
    const doc = document.documentElement;
    const maxScroll = Math.max(0, doc.scrollHeight - vh);
    const nearBottom = maxScroll > 0 && y > maxScroll - vh * 0.35;
    const pastFold = y > vh * 0.45;
    const show = pastFold || nearBottom;
    scrollTopBtn.classList.toggle("is-visible", show);
  }

  function scrollToTopAnimated() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function updateNav() {
    if (!nav) return;

    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const memoryTop = memory ? memory.getBoundingClientRect().top : Infinity;
    const finaleTop = finale ? finale.getBoundingClientRect().top : Infinity;
    
    const onDark = finaleTop < 200;    const pastHero = heroBottom < 80;

    const logo = nav.querySelector(".nav-logo");
    const links = nav.querySelectorAll(".nav-links a");

    nav.className = "fixed left-0 right-0 top-0 z-50 transition-all duration-300";

    // If mobile menu is open, lock text/icons to white
    if (isMenuOpen) {
      nav.classList.add("bg-transparent");
      if (logo) logo.className = "nav-logo text-[17px] font-semibold tracking-tight text-white";
      burgerLines.forEach(l => l.className = "block h-[2px] w-full rounded-full bg-white transition-all duration-300");
      // Animate to 'X'
      burgerLines[0].classList.add("rotate-45", "translate-y-[7px]");
      burgerLines[1].classList.add("opacity-0");
      burgerLines[2].classList.add("-rotate-45", "-translate-y-[7px]");
      return; 
    }

    if (onDark) {
      // Dark sections
      nav.classList.add("bg-neutral-950/90", "backdrop-blur-md", "border-b", "border-white/5");
      if (logo) logo.className = "nav-logo text-[17px] font-semibold tracking-tight text-white hover:text-teal-400 transition-colors";
      links.forEach(l => l.className = "transition-colors hover:text-teal-400 text-white/80");
      burgerLines.forEach(l => l.className = "block h-[2px] w-full rounded-full bg-white transition-all duration-300");
      } else if (pastHero) {
        // Light sections
        nav.classList.add("bg-white/95", "backdrop-blur-md", "border-b", "border-neutral-200", "shadow-sm");
        if (logo) logo.className = "nav-logo text-[17px] font-semibold tracking-tight text-neutral-900 hover:text-teal-600 transition-colors";
        links.forEach(l => l.style.color = "#2f7a7f");
        burgerLines.forEach(l => l.className = "block h-[2px] w-full rounded-full bg-neutral-900 transition-all duration-300");    } else {
      // Hero section
      nav.classList.add("bg-transparent", "pt-2"); 
      if (logo) logo.className = "nav-logo text-[17px] font-semibold tracking-tight text-white hover:text-teal-400 transition-colors";
      links.forEach(l => l.className = "transition-colors hover:text-teal-400 text-white/90");
      burgerLines.forEach(l => l.className = "block h-[2px] w-full rounded-full bg-white transition-all duration-300");
    }
  }

  function toggleMenu() {
    if (!mobileMenu || !mobileBtn) return;
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      mobileMenu.classList.remove("opacity-0", "pointer-events-none");
      mobileMenu.classList.add("opacity-100", "pointer-events-auto");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      document.body.style.overflow = "";
      
      // Reset burger lines
      burgerLines[0].classList.remove("rotate-45", "translate-y-[7px]");
      burgerLines[1].classList.remove("opacity-0");
      burgerLines[2].classList.remove("-rotate-45", "-translate-y-[7px]");
    }
    updateNav();
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  function updateManifestoOpacity() {
    if (!manifestoSection || !manifestoLines.length) return;
    const rect = manifestoSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const sectionHeight = rect.height;
    const centerOffset = rect.top + sectionHeight / 2 - vh / 2;
    const maxDist = vh * 0.55;
    const base = Math.max(0, Math.min(1, 1 - Math.abs(centerOffset) / maxDist));

    manifestoLines.forEach((line, i) => {
      const stagger = i * 0.12;
      const opacity = 0.25 + base * 0.75 * (1 - stagger);
      line.style.opacity = Math.max(0.2, Math.min(1, opacity)).toFixed(2);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-reveal-scale]").forEach((el) => io.observe(el));

  const budgetBar = document.getElementById('budget-progress');
  if (budgetBar) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute('data-target');
          barObserver.unobserve(bar); 
        }
      });
    }, { threshold: 0.5 });
    barObserver.observe(budgetBar);
  }

  const texts = ["City, country, or vibe", "Siargao, #SlowSurf", "Tokyo, #Foodie", "Palawan, Island Hopping"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const input = document.getElementById("destination-input");

  function typeEffect() {
    if (!input) return;
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      input.placeholder = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      input.placeholder = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
  }

  if (input) setTimeout(typeEffect, 1500);

  window.addEventListener("scroll", () => {
    updateNav();
    updateManifestoOpacity();
    updateScrollTopBtn();
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateNav();
    updateManifestoOpacity();
    updateScrollTopBtn();
    
    if (window.innerWidth >= 1024 && isMenuOpen) {
      toggleMenu();
    }
  });

  scrollTopBtn?.addEventListener("click", () => {
    scrollToTopAnimated();
  });

  updateNav();
  updateManifestoOpacity();
  updateScrollTopBtn();
})();