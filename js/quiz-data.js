// RASCUNHO: a Suellen pode trocar, tirar ou incluir perguntas.
// type "choice" = múltipla escolha (avança sozinho ao clicar).
// type "text"   = resposta aberta, escrita pela pessoa.
// Todas as respostas vão para a planilha de leads e para a mensagem de WhatsApp.
window.SUI_QUIZ = {
  questions: [
    {
      id: "relacao",
      type: "choice",
      text: "Hoje, como é a sua relação com a maquiagem?",
      options: [
        "Quase não uso, não sei por onde começar",
        "Uso o básico, sempre do mesmo jeito",
        "Uso bastante, mas não fico 100% satisfeita",
        "Amo maquiagem e quero aprender mais",
      ],
    },
    {
      id: "dificuldade",
      type: "choice",
      text: "Qual é a sua maior dificuldade hoje?",
      options: [
        "Pele: base, corretivo e acabamento",
        "Olhos: sombra, delineado e cílios",
        "Sobrancelha",
        "Escolher cores e produtos",
        "Fazer a make durar o dia todo",
      ],
    },
    {
      id: "ocasiao",
      type: "choice",
      text: "Para qual momento você mais quer aprender a se maquiar?",
      options: [
        "Trabalho e rotina",
        "Eventos e ocasiões especiais",
        "Fotos e redes sociais",
        "Para me sentir bem comigo mesma",
      ],
    },
    {
      id: "queixa",
      type: "text",
      text: "Com as suas palavras: o que mais te incomoda quando você se olha no espelho ou tenta se maquiar?",
      hint: "Não existe resposta certa. Pode ser um traço do rosto, uma insegurança ou algo que nunca dá certo na make.",
      placeholder: "Ex.: sinto que meus olhos ficam pequenos, não sei afinar o rosto...",
      minLength: 3,
    },
  ],
};
