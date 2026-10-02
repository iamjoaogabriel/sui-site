(function () {
  const cfg = window.SUI_CONFIG || {};

  function waLink(message) {
    const text = encodeURIComponent(message || "Olá, Sui!");
    return cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${text}` : `https://wa.me/?text=${text}`;
  }
  window.suiWaLink = waLink;

  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = cfg.instagram || "#";
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const bookingBtn = document.querySelector("[data-booking]");
  const bookingFrame = document.querySelector("[data-booking-frame]");
  if (bookingBtn) {
    if (cfg.bookingUrl) {
      bookingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!bookingFrame.hasChildNodes()) {
          const iframe = document.createElement("iframe");
          iframe.src = cfg.bookingUrl;
          iframe.title = "Agenda da Sui: escolha seu horário";
          iframe.loading = "lazy";
          bookingFrame.appendChild(iframe);
        }
        bookingFrame.hidden = false;
        bookingFrame.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      bookingBtn.href = waLink("Olá, Sui! Gostaria de agendar um horário.");
      bookingBtn.target = "_blank";
      bookingBtn.rel = "noopener";
    }
  }

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (header) {
    const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle) {
    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
    document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  }

  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const img = lightbox.querySelector("img");
    document.querySelectorAll(".gallery [data-full]").forEach((btn) => {
      btn.addEventListener("click", () => {
        img.src = btn.dataset.full;
        img.alt = btn.querySelector("img").alt;
        lightbox.showModal();
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => e.target === lightbox && lightbox.close());
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
