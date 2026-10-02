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

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gallery = document.querySelector(".gallery");
  const galleryItems = gallery ? [...gallery.querySelectorAll("[data-full]")] : [];
  galleryItems.forEach((btn, i) => btn.style.setProperty("--i", i));

  if (gallery && !reduceMotion) {
    // Velocidade por coluna: fotos da mesma coluna andam juntas e o espaçamento entre elas não muda.
    const speedsByColumns = { 4: [0.07, -0.05, 0.1, -0.04], 2: [0.035, -0.03] };
    let ticking = false;
    let active = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const rect = gallery.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - vh / 2;
      const cols = getComputedStyle(gallery).gridTemplateColumns.split(" ").length;
      const speeds = speedsByColumns[cols] || speedsByColumns[2];
      galleryItems.forEach((btn, i) => {
        const py = Math.max(-70, Math.min(70, distance * speeds[i % cols]));
        btn.style.setProperty("--py", py.toFixed(1) + "px");
      });
    };
    const onScroll = () => {
      if (active && !ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) update();
    }, { rootMargin: "200px 0px" }).observe(gallery);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  const lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryItems.length) {
    const img = lightbox.querySelector(".lightbox-img");
    const caption = lightbox.querySelector("[data-lb-caption]");
    const count = lightbox.querySelector("[data-lb-count]");
    let current = 0;

    const render = (i) => {
      current = (i + galleryItems.length) % galleryItems.length;
      const btn = galleryItems[current];
      img.src = btn.dataset.full;
      img.alt = btn.querySelector("img").alt;
      caption.textContent = btn.querySelector("figcaption").textContent;
      count.textContent = `${current + 1} / ${galleryItems.length}`;
    };
    const go = (step) => {
      if (reduceMotion) return render(current + step);
      img.classList.add("is-changing");
      setTimeout(() => {
        render(current + step);
        img.classList.remove("is-changing");
      }, 200);
    };

    galleryItems.forEach((btn, i) => btn.addEventListener("click", () => {
      render(i);
      lightbox.showModal();
    }));
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => go(-1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => go(1));
    lightbox.addEventListener("click", (e) => (e.target === lightbox || e.target.classList.contains("lightbox-bar")) && lightbox.close());
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
    let touchX = null;
    lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      touchX = null;
    });
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
