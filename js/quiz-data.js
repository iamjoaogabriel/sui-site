// RASCUNHO: substituir pelas perguntas da Suellen.
// Cada opção soma pontos nos perfis em "scores". Perguntas sem "scores" não pontuam,
// mas a resposta vai junto para o WhatsApp e para a planilha (útil na hora da venda).
window.SUI_QUIZ = {
  profiles: {
    essencial: {
      title: "Essencial Descomplicada",
      teaser: "Você quer se sentir arrumada sem perder tempo e sem precisar de mil produtos. O seu caminho é uma make curta, certeira e que valoriza o que você já tem.",
      tip: "Seu ponto de partida: uma rotina de até 10 minutos com poucos itens bem escolhidos.",
    },
    construcao: {
      title: "Em Construção",
      teaser: "Você já se maquia, mas sente que o resultado nem sempre fica como imaginou. Com alguns ajustes de técnica, a sua make vai ficar mais natural, duradoura e com a sua cara.",
      tip: "Seu ponto de partida: corrigir os detalhes que fazem a make parecer pesada ou sem acabamento.",
    },
    expressiva: {
      title: "Expressiva e Versátil",
      teaser: "Você ama maquiagem e quer ir além. O seu próximo passo é dominar técnicas para transitar do dia para a noite com segurança e criar looks com intenção.",
      tip: "Seu ponto de partida: técnicas de olhos, contorno e transição de make dia para noite.",
    },
  },

  questions: [
    {
      id: "relacao",
      text: "Hoje, como é a sua relação com a maquiagem?",
      options: [
        { label: "Quase não uso, não sei bem por onde começar", scores: { essencial: 3 } },
        { label: "Uso o básico, mas sempre igual", scores: { essencial: 1, construcao: 2 } },
        { label: "Uso com frequência, mas não fico 100% satisfeita", scores: { construcao: 3 } },
        { label: "Amo maquiagem e gosto de testar coisas novas", scores: { expressiva: 3 } },
      ],
    },
    {
      id: "tempo",
      text: "Quanto tempo você tem para se maquiar no dia a dia?",
      options: [
        { label: "Até 5 minutos", scores: { essencial: 3 } },
        { label: "Entre 5 e 15 minutos", scores: { construcao: 2, essencial: 1 } },
        { label: "Mais de 15 minutos, sem problema", scores: { expressiva: 2, construcao: 1 } },
      ],
    },
    {
      id: "dificuldade",
      text: "Qual é a sua maior dificuldade hoje?",
      options: [
        { label: "Pele: base, corretivo, acabamento", scores: { construcao: 2 } },
        { label: "Olhos: sombra, delineado, cílios", scores: { expressiva: 2 } },
        { label: "Sobrancelha", scores: { construcao: 1, essencial: 1 } },
        { label: "Escolher cores e produtos", scores: { essencial: 2 } },
        { label: "Fazer a make durar o dia todo", scores: { construcao: 2 } },
      ],
    },
    {
      id: "espelho",
      text: "Quando você termina a make e se olha no espelho, normalmente sente...",
      options: [
        { label: "Que ficou pesada ou artificial", scores: { construcao: 3 } },
        { label: "Que não fez muita diferença", scores: { essencial: 2, construcao: 1 } },
        { label: "Que ficou boa, mas poderia ser melhor", scores: { construcao: 1, expressiva: 2 } },
        { label: "Que eu mesma nunca me arrumo, só quando alguém faz", scores: { essencial: 3 } },
      ],
    },
    {
      id: "produtos",
      text: "Quantos produtos de maquiagem você tem hoje?",
      options: [
        { label: "Quase nenhum", scores: { essencial: 3 } },
        { label: "Alguns, mas não uso todos", scores: { construcao: 2 } },
        { label: "Muitos, e gosto de ter opções", scores: { expressiva: 3 } },
      ],
    },
    {
      id: "ocasiao",
      text: "Para qual momento você mais quer aprender a se maquiar?",
      options: [
        { label: "Trabalho e rotina" },
        { label: "Eventos e ocasiões especiais" },
        { label: "Fotos e redes sociais" },
        { label: "Para me sentir bem comigo mesma" },
      ],
    },
    {
      id: "desejo",
      text: "O que você mais quer sentir em relação à sua imagem?",
      options: [
        { label: "Praticidade: estar bem sem esforço", scores: { essencial: 2 } },
        { label: "Segurança: saber exatamente o que fazer", scores: { construcao: 2 } },
        { label: "Liberdade: criar e ousar quando quiser", scores: { expressiva: 2 } },
      ],
    },
  ],
};
