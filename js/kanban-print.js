// ============================================================
// KANBAN PRINT — Impressão A4 do espelho de posição
// Resolve lotes no contexto da janela principal antes de abrir popup
// ============================================================

function imprimirKanban(avalia, modelo, posKey) {

    // ── Resolve lotes AQUI (no contexto da janela principal) ─
    const itensComLote = avalia.itens.map(comp => {
        const loteKey = posKey + '|' + comp.pn;
        // Acessa KS diretamente — ainda estamos na janela principal
        const lotesArr = KS?.lotesMap?.get(loteKey) || [];
        return {
            pn:    comp.pn,
            desc:  comp.desc,
            qtd:   comp.qtdReal,
            mult:  comp.mult || 1,
            lotes: lotesArr,
        };
    });

    // ── Monta linhas da tabela ───────────────────────────────
    const linhas = itensComLote.map(comp => {
        const qtdStr  = comp.qtd > 0
            ? comp.qtd.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '—';
        const loteStr = comp.lotes.length > 0 ? comp.lotes.join(' / ') : '—';
        const multStr = comp.mult.toFixed(2).replace('.', ',');

        return `
        <tr>
            <td class="pn">${comp.pn}</td>
            <td class="desc">${comp.desc}</td>
            <td class="num">${qtdStr}</td>
            <td class="lote">${loteStr}</td>
            <td class="num">${multStr}</td>
        </tr>`;
    }).join('');

    // ── HTML da folha A4 ────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Kanban ${posKey}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 12mm 14mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    color: #000;
    background: #fff;
  }

  .modelo-header {
    text-align: center;
    font-size: 18pt;
    font-weight: bold;
    padding: 8px 0 6px;
    background: #ffffcc;
    border: 1px solid #ccc;
    margin-bottom: 0;
    letter-spacing: .05em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead tr { background: #f4a460; }
  thead th {
    border: 1px solid #888;
    padding: 7px 8px;
    font-size: 10pt;
    font-weight: bold;
    font-style: italic;
    text-align: left;
  }
  tbody tr { border-bottom: 1px solid #ddd; }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody td {
    border: 1px solid #ccc;
    padding: 9px 8px;
    font-size: 11pt;
    vertical-align: middle;
  }
  .pn   { font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: nowrap; }
  .num  { text-align: right; white-space: nowrap; }
  .lote { font-size: 10pt; }

  .posicao-block {
    margin-top: 20mm;
    text-align: center;
  }
  .posicao-label {
    font-size: 96pt;
    font-weight: 900;
    letter-spacing: -4px;
    line-height: 1;
    color: #000;
  }

  .footer {
    margin-top: 18mm;
    display: flex;
    justify-content: space-between;
    font-size: 14pt;
    font-weight: bold;
  }
</style>
</head>
<body>

  <div class="modelo-header">${modelo?.nome || '—'}</div>

  <table>
    <thead>
      <tr>
        <th style="width:18%">Componente</th>
        <th>Descrição</th>
        <th style="width:13%">Quantidade</th>
        <th style="width:22%">Lote</th>
        <th style="width:9%">Múltiplo</th>
      </tr>
    </thead>
    <tbody>
      ${linhas}
    </tbody>
  </table>

  <div class="posicao-block">
    <div class="posicao-label">${posKey}</div>
  </div>

  <div class="footer">
    <span>CONFERENTE:</span>
    <span>DATA:</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
      window.onfocus = function() { setTimeout(() => window.close(), 300); };
    };
  </script>
</body>
</html>`;

    // ── Abre popup ───────────────────────────────────────────
    const popup = window.open('', '_blank', 'width=794,height=1123,menubar=no,toolbar=no,location=no');
    if (!popup) {
        // Fallback: iframe oculto
        let iframe = document.getElementById('_kanban_print_frame');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = '_kanban_print_frame';
            iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
            document.body.appendChild(iframe);
        }
        iframe.onload = () => {
            try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch(e) {}
        };
        iframe.srcdoc = html;
        return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
}

window.imprimirKanban = imprimirKanban;
console.log('✅ kanban-print.js carregado');
