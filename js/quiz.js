(function () {
  const cfg = window.SUI_CONFIG || {};
  const quiz = window.SUI_QUIZ;
  const root = document.querySelector("[data-quiz]");
  if (!root || !quiz) return;

  const screens = {
    intro: root.querySelector('[data-screen="intro"]'),
    question: root.querySelector('[data-screen="question"]'),
    lead: root.querySelector('[data-screen="lead"]'),
    result: root.querySelector('[data-screen="result"]'),
  };
  const progress = root.querySelector("[data-progress]");
  const progressBar = progress.querySelector("span");
  const qCount = root.querySelector("[data-q-count]");
  const qText = root.querySelector("[data-q-text]");
  const qOptions = root.querySelector("[data-q-options]");
  const backBtn = root.querySelector("[data-back]");
  const form = root.querySelector("[data-lead-form]");
  const phoneInput = form.querySelector('[name="whatsapp"]');
  const formError = form.querySelector("[data-form-error]");

  const total = quiz.questions.length;
  let index = 0;
  const answers = new Array(total).fill(null);
  let lead = null;

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
    progress.hidden = name === "intro";
    const focusTarget = screens[name].querySelector("h1, h2, legend");
    if (focusTarget) {
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setProgress(step) {
    const pct = Math.round((step / (total + 1)) * 100);
    progressBar.style.width = pct + "%";
    progress.setAttribute("aria-valuenow", String(pct));
  }

  function renderQuestion() {
    const q = quiz.questions[index];
    qCount.textContent = `Pergunta ${index + 1} de ${total}`;
    qText.textContent = q.text;
    qOptions.replaceChildren();
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.setAttribute("aria-pressed", String(answers[index] === i));
      btn.innerHTML = `<span class="quiz-letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span></span>`;
      btn.lastChild.textContent = opt.label;
      btn.addEventListener("click", () => choose(i, btn));
      qOptions.appendChild(btn);
    });
    setProgress(index);
    show("question");
  }

  function choose(i, btn) {
    answers[index] = i;
    qOptions.querySelectorAll(".quiz-option").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    qOptions.classList.add("is-locked");
    setTimeout(() => {
      qOptions.classList.remove("is-locked");
      if (index < total - 1) {
        index += 1;
        renderQuestion();
      } else {
        setProgress(total);
        show("lead");
      }
    }, 280);
  }

  function computeProfile() {
    const totals = Object.fromEntries(Object.keys(quiz.profiles).map((k) => [k, 0]));
    quiz.questions.forEach((q, qi) => {
      const opt = q.options[answers[qi]];
      if (opt && opt.scores) {
        Object.entries(opt.scores).forEach(([k, v]) => { totals[k] = (totals[k] || 0) + v; });
      }
    });
    const order = Object.keys(quiz.profiles);
    return order.reduce((best, k) => (totals[k] > totals[best] ? k : best), order[0]);
  }

  function answersSummary() {
    return quiz.questions.map((q, qi) => ({ pergunta: q.text, resposta: q.options[answers[qi]].label }));
  }

  function buildWhatsAppMessage(profile) {
    const lines = [
      `Olá, Sui! Fiz o diagnóstico de automaquiagem no site.`,
      ``,
      `Meu nome é ${lead.nome} e meu perfil deu: *${profile.title}*.`,
      ``,
      `Minhas respostas:`,
      ...answersSummary().map((a) => `• ${a.pergunta} ${a.resposta}`),
      ``,
      `Quero receber meu diagnóstico completo!`,
    ];
    return lines.join("\n");
  }

  function sendLead(profileKey) {
    if (!cfg.leadsEndpoint) return;
    const payload = {
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      perfil: quiz.profiles[profileKey].title,
      respostas: answersSummary().map((a) => `${a.pergunta} ${a.resposta}`).join(" | "),
      origem: document.referrer || "direto",
    };
    fetch(cfg.leadsEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  function renderResult() {
    const key = computeProfile();
    const profile = quiz.profiles[key];
    const firstName = lead.nome.split(" ")[0];
    root.querySelector("[data-r-eyebrow]").textContent = `${firstName}, seu perfil é`;
    root.querySelector("[data-r-title]").textContent = profile.title;
    root.querySelector("[data-r-teaser]").textContent = profile.teaser;
    root.querySelector("[data-r-tip]").textContent = profile.tip;
    root.querySelector("[data-r-wa]").href = window.suiWaLink(buildWhatsAppMessage(profile));
    sendLead(key);
    progressBar.style.width = "100%";
    show("result");
  }

  function maskPhone(value) {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  phoneInput.addEventListener("input", () => { phoneInput.value = maskPhone(phoneInput.value); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim().replace(/\s+/g, " ");
    const digits = form.whatsapp.value.replace(/\D/g, "");
    let error = "";
    if (nome.length < 2) error = "Digite o seu nome.";
    else if (digits.length < 10) error = "Digite um WhatsApp válido, com DDD.";
    else if (!form.consentimento.checked) error = "Para continuar, aceite receber o resultado pelo WhatsApp.";
    formError.textContent = error;
    if (error) return;
    lead = { nome, whatsapp: "55" + digits };
    renderResult();
  });

  root.querySelector("[data-start]").addEventListener("click", () => {
    index = 0;
    renderQuestion();
  });

  backBtn.addEventListener("click", () => {
    if (index > 0) {
      index -= 1;
      renderQuestion();
    } else {
      show("intro");
    }
  });

  root.querySelector("[data-lead-back]").addEventListener("click", () => {
    index = total - 1;
    renderQuestion();
  });

  root.querySelector("[data-restart]").addEventListener("click", () => {
    answers.fill(null);
    index = 0;
    renderQuestion();
  });
})();
