// ============================================================
// KANBAN PRINT — Impressão A4 do espelho de posição
// Impressão nativa via window.print() — sem PDF, sem servidor
// ============================================================

/**
 * Abre janela de impressão A4 com o espelho da posição Kanban.
 * @param {object} avalia  - resultado de avaliarPosicao()
 * @param {object} modelo  - modelo { nome, barColor, pos }
 * @param {string} posKey  - ex: "F11-01"
 */
function imprimirKanban(avalia, modelo, posKey) {
    // ── Monta linhas da tabela ───────────────────────────────
    const linhas = avalia.itens.map(comp => {
        const qtd   = comp.qtdReal > 0 ? comp.qtdReal.toLocaleString('pt-BR') : '—';
        // Lote: busca no KS.lotesMap se disponível
        const loteKey = posKey + '|' + comp.pn;
        const lotes   = (window.KS?.lotesMap?.get(loteKey) || []);
        const loteStr = lotes.length > 0 ? lotes.join(' / ') : '—';
        const mult    = comp.mult ? comp.mult.toFixed(2).replace('.', ',') : '1,00';

        return `
        <tr>
            <td class="pn">${comp.pn}</td>
            <td class="desc">${comp.desc}</td>
            <td class="num">${qtd}</td>
            <td class="lote">${loteStr}</td>
            <td class="num">${mult}</td>
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

  /* ── Cabeçalho do modelo ─────────────────────────── */
  .modelo-header {
    text-align: center;
    font-size: 16pt;
    font-weight: bold;
    padding: 6px 0 4px;
    background: #ffffcc;
    border: 1px solid #ccc;
    margin-bottom: 0;
  }

  /* ── Tabela de componentes ───────────────────────── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  thead tr {
    background: #f4a460;
  }
  thead th {
    border: 1px solid #888;
    padding: 5px 6px;
    font-size: 9pt;
    font-weight: bold;
    font-style: italic;
    text-align: left;
  }
  tbody tr {
    border-bottom: 1px solid #ddd;
  }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody td {
    border: 1px solid #ccc;
    padding: 5px 6px;
    font-size: 9.5pt;
    vertical-align: middle;
  }
  .pn   { font-family: 'Courier New', monospace; font-size: 8.5pt; white-space: nowrap; }
  .desc { }
  .num  { text-align: right; white-space: nowrap; }
  .lote { font-size: 8.5pt; }

  /* ── Posição em destaque ─────────────────────────── */
  .posicao-block {
    margin-top: 18mm;
    text-align: center;
  }
  .posicao-label {
    font-size: 72pt;
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1;
    color: #000;
  }

  /* ── Rodapé conferente / data ────────────────────── */
  .footer {
    margin-top: 18mm;
    display: flex;
    justify-content: space-between;
    font-size: 13pt;
    font-weight: bold;
  }
  .footer span { min-width: 200px; }
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
      // Fecha a janela após imprimir (ou cancelar)
      window.onfocus = function() { setTimeout(() => window.close(), 300); };
    };
  </script>
</body>
</html>`;

    // ── Abre popup e imprime ─────────────────────────────────
    const popup = window.open('', '_blank', 'width=794,height=1123,menubar=no,toolbar=no,location=no');
    if (!popup) {
        // Fallback: popup bloqueado — usa iframe oculto
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
