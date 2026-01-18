document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("itens-carrinho");
  const totalElement = document.getElementById("total");
  const estudanteCheckbox = document.getElementById("estudante");
  const cupaoInput = document.getElementById("cupao");
  const comprarBtn = document.getElementById("comprar-btn");
  const resultadoDiv = document.getElementById("resultado-compra");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const subtotalEl = document.getElementById('subtotal');
  // totalElement already references the #total element in the page

  function computeSubtotal() {
    return (carrinho || []).reduce((s, p) => s + (p.price ?? 0), 0);
  }

  function parseCouponPercent(coupon) {
    if (!coupon) return 0;
    const m = coupon.match(/DESCONTO(\d{1,2})/i);
    if (m) {
      const v = Number(m[1]);
      if (!Number.isNaN(v) && v > 0 && v <= 100) return v / 100;
    }
    return 0;
  }

  function computePreviewTotal() {
    const subtotal = computeSubtotal();
    const estudante = estudanteCheckbox.checked;
    const cupao = cupaoInput.value.trim();
    let desconto = 0;
    if (estudante) desconto += 0.10; // hipótese: 10% estudante
    desconto += parseCouponPercent(cupao);
    if (desconto > 0.99) desconto = 0.99;
    const total = subtotal * (1 - desconto);
    return { subtotal, total, desconto };
  }

  function renderCarrinho() {
    container.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
      container.innerHTML = "<p>O carrinho está vazio.</p>";
      totalElement.textContent = "Custo total: €0.00";
      return;
    }

    carrinho.forEach((produto) => {
      const div = document.createElement("div");
      div.classList.add("item-carrinho");
      div.innerHTML = `
        <img src="${produto.image}" alt="${produto.title}">
        <h4>${produto.title}</h4>
        <p>€${produto.price.toFixed(2)}</p>
      `;
      container.appendChild(div);
      total += produto.price;
    });

    // Atualiza subtotal (#subtotal) e total previsto (#total)
    if (subtotalEl) subtotalEl.textContent = `€${total.toFixed(2)}`;
    const preview = computePreviewTotal();
    if (totalElement) totalElement.textContent = `€${preview.total.toFixed(2)}`;
  }

  renderCarrinho();

 
  // Atualiza preview quando cupão ou estudante mudam
  estudanteCheckbox.addEventListener('change', () => renderCarrinho());
  cupaoInput.addEventListener('input', () => renderCarrinho());

  comprarBtn.addEventListener("click", async () => {
    if (carrinho.length === 0) {
      alert("O carrinho está vazio!");
      return;
    }

    const isEstudante = estudanteCheckbox.checked;
    const cupao = cupaoInput.value.trim();

    
    const produtosIds = carrinho.map(p => p.id);

    const dadosCompra = {
      products: produtosIds,
      student: isEstudante,
      coupon: cupao
    };

    try {
      const resposta = await fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCompra)
      });

      // Tenta ler JSON da resposta. Se falhar, pega o texto cru para debug.
      let resultado;
      try {
        resultado = await resposta.json();
      } catch (errJson) {
        const text = await resposta.text();
        console.error('Resposta não JSON do servidor:', text);
        resultadoDiv.innerHTML = `<p style="color:red;">Erro: resposta inválida do servidor (não JSON). Status: ${resposta.status}</p><pre>${text}</pre>`;
        return;
      }

      if (!resposta.ok) {
        // Se o servidor devolve mensagens de erro em fields diferentes, mostramos tudo para ajudar a depurar
        console.error('Erro na resposta do servidor:', resposta.status, resultado);
        const detalhe = resultado.detail || resultado.error || resultado.message || JSON.stringify(resultado);
        resultadoDiv.innerHTML = `<p style="color:red;">Erro: ${detalhe}</p>`;
        return;
      }

      // Sucesso: o servidor respondeu com dados — tentamos extrair o total em várias chaves possíveis
      console.log('Resultado compra:', resultado);
      const totalServer = resultado.total ?? resultado.total_amount ?? resultado.amount ?? resultado.totalPrice ?? resultado.total_price ?? resultado.total_value ?? resultado.payment_total;

      // Se não houver total no servidor, calculamos um fallback local (sem confiança em descontos aplicados pelo servidor)
      let displayTotal;
      if (typeof totalServer === 'number') {
        displayTotal = totalServer.toFixed(2);
      } else {
        const fallback = computeSubtotal();
        displayTotal = fallback.toFixed(2);
        console.warn('Servidor não devolveu total; usando total calculado localmente (pode não incluir descontos):', fallback);
      }

      // Mostrar resultado e também o JSON do servidor para debug (se houver discrepância nos descontos)
      resultadoDiv.innerHTML = `
        <h3>Compra realizada com sucesso!</h3>
        <p><strong>Referência de pagamento:</strong> ${resultado.reference ?? '-'} </p>
        <p><strong>Total a pagar (servidor):</strong> €${displayTotal}</p>
        <details style="margin-top:0.5rem"><summary>Mostrar resposta do servidor (debug)</summary><pre>${JSON.stringify(resultado, null, 2)}</pre></details>
      `;

      // Esvazia o carrinho e notifica outras partes da app (manter array vazio para disparar storage nas outras abas)
      localStorage.setItem("carrinho", JSON.stringify([]));
      document.dispatchEvent(new CustomEvent('carrinhoAtualizado'));

    } catch (erro) {
      console.error('Erro no fetch/checkout:', erro);
      resultadoDiv.innerHTML = `<p style="color:red;">Erro ao processar compra. Veja o console para mais detalhes.</p>`;
    }
  });
});
