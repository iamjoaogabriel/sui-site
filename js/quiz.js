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
  const qHint = root.querySelector("[data-q-hint]");
  const qOptions = root.querySelector("[data-q-options]");
  const qOpen = root.querySelector("[data-q-open]");
  const qOpenInput = qOpen.querySelector("textarea");
  const qOpenLabel = qOpen.querySelector("[data-q-open-label]");
  const qOpenError = qOpen.querySelector("[data-q-open-error]");
  const form = root.querySelector("[data-lead-form]");
  const phoneInput = form.querySelector('[name="whatsapp"]');
  const formError = form.querySelector("[data-form-error]");

  const questions = quiz.questions;
  const total = questions.length;
  let index = 0;
  const answers = new Array(total).fill(null);
  let lead = null;

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
    progress.hidden = name === "intro";
    const focusTarget = screens[name].querySelector("h1, h2");
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

  function next() {
    if (index < total - 1) {
      index += 1;
      renderQuestion();
    } else {
      setProgress(total);
      show("lead");
    }
  }

  function renderQuestion() {
    const q = questions[index];
    qCount.textContent = `Pergunta ${index + 1} de ${total}`;
    qText.textContent = q.text;
    qHint.textContent = q.hint || "";
    qHint.hidden = !q.hint;
    qOptions.replaceChildren();
    qOpenError.textContent = "";

    const isText = q.type === "text";
    qOptions.hidden = isText;
    qOpen.hidden = !isText;

    if (isText) {
      qOpenLabel.textContent = q.text;
      qOpenInput.placeholder = q.placeholder || "";
      qOpenInput.value = answers[index] || "";
    } else {
      q.options.forEach((label, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.setAttribute("aria-pressed", String(answers[index] === label));
        btn.innerHTML = `<span class="quiz-letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span></span>`;
        btn.lastChild.textContent = label;
        btn.addEventListener("click", () => choose(label, btn));
        qOptions.appendChild(btn);
      });
    }
    setProgress(index);
    show("question");
    if (isText) qOpenInput.focus({ preventScroll: true });
  }

  function choose(label, btn) {
    answers[index] = label;
    qOptions.querySelectorAll(".quiz-option").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    qOptions.classList.add("is-locked");
    setTimeout(() => {
      qOptions.classList.remove("is-locked");
      next();
    }, 280);
  }

  qOpenInput.addEventListener("input", () => { qOpenError.textContent = ""; });

  qOpen.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = questions[index];
    const value = qOpenInput.value.trim().replace(/\s+/g, " ");
    if (value.length < (q.minLength || 1)) {
      qOpenError.textContent = "Escreva um pouquinho para eu entender o que você precisa.";
      return;
    }
    answers[index] = value;
    next();
  });

  function answersSummary() {
    return questions.map((q, qi) => ({ id: q.id, pergunta: q.text, resposta: answers[qi] || "" }));
  }

  function buildWhatsAppMessage() {
    const queixa = answersSummary().find((a) => a.id === "queixa");
    const lines = [
      `Olá, Sui! Preenchi o formulário do e-book de automaquiagem visagista no site.`,
      `Meu nome é ${lead.nome}.`,
    ];
    if (queixa && queixa.resposta) lines.push("", `O que mais me incomoda: ${queixa.resposta}`);
    lines.push("", "Gostaria de uma ajuda personalizada!");
    return lines.join("\n");
  }

  function sendLead() {
    if (!cfg.leadsEndpoint) return;
    const summary = answersSummary();
    const queixa = summary.find((a) => a.id === "queixa");
    const payload = {
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      queixa: queixa ? queixa.resposta : "",
      respostas: summary.filter((a) => a.id !== "queixa").map((a) => `${a.pergunta} ${a.resposta}`).join(" | "),
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
    const firstName = lead.nome.split(" ")[0];
    root.querySelector("[data-r-eyebrow]").textContent = `Obrigada, ${firstName}`;
    const link = root.querySelector("[data-ebook-link]");
    const pending = root.querySelector("[data-ebook-pending]");
    const title = root.querySelector("[data-r-title]");
    const hasEbook = Boolean(cfg.ebookUrl);
    link.hidden = !hasEbook;
    pending.hidden = hasEbook;
    if (hasEbook) link.href = cfg.ebookUrl;
    title.innerHTML = hasEbook ? "Seu e-book está <em>pronto.</em>" : "Recebi as suas <em>respostas.</em>";
    root.querySelector("[data-r-wa]").href = window.suiWaLink(buildWhatsAppMessage());
    sendLead();
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
    else if (!form.consentimento.checked) error = "Para continuar, aceite os termos acima.";
    formError.textContent = error;
    if (error) return;
    lead = { nome, whatsapp: "55" + digits };
    renderResult();
  });

  root.querySelector("[data-start]").addEventListener("click", () => {
    index = 0;
    renderQuestion();
  });

  root.querySelector("[data-back]").addEventListener("click", () => {
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
})();
