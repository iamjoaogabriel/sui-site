// Cole este código em: Planilha Google > Extensões > Apps Script.
// Depois: Implantar > Nova implantação > Tipo "App da Web"
//   Executar como: Eu | Quem pode acessar: Qualquer pessoa
// Copie a URL gerada e cole em js/config.js -> leadsEndpoint.

const ABA = "Leads";
const COLUNAS = ["Data", "Nome", "WhatsApp", "Queixa", "Respostas", "Origem"];

// Impede que um valor começando com = + - @ seja interpretado como fórmula.
function texto(valor, max) {
  const s = String(valor || "").slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const dados = JSON.parse(e.postData.contents);
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    let aba = planilha.getSheetByName(ABA);
    if (!aba) {
      aba = planilha.insertSheet(ABA);
      aba.appendRow(COLUNAS);
      aba.setFrozenRows(1);
    }
    aba.appendRow([
      new Date(),
      texto(dados.nome, 120),
      "'" + String(dados.whatsapp || "").replace(/\D/g, "").slice(0, 15),
      texto(dados.queixa, 1000),
      texto(dados.respostas, 2000),
      texto(dados.origem, 300),
    ]);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
