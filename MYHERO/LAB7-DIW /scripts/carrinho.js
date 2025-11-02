document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("itens-carrinho");
  const totalElement = document.getElementById("total");
  const esvaziarBtn = document.getElementById("esvaziar");
  
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Listen for cart updates from main.js
  document.addEventListener('carrinhoAtualizado', () => {
    carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    renderCarrinho();
  });

  function renderCarrinho() {
    container.innerHTML = "";

    if (carrinho.length === 0) {
      container.innerHTML = "<p>O carrinho está vazio.</p>";
      totalElement.textContent = "Total: €0.00";
      return;
    }

    let total = 0;

    carrinho.forEach((produto, index) => {
      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      div.innerHTML = `
        <img src="${produto.image || produto.image_url}" alt="${produto.title}">
        <div class="info-produto">
          <h3>${produto.title}</h3>
          <p>€${produto.price.toFixed(2)}</p>
        </div>
        <button class="remover-btn" data-index="${index}">❌ Remover</button>
      `;

      container.appendChild(div);
      total += produto.price;
    });

    totalElement.textContent = `Total: €${total.toFixed(2)}`;

    
    document.querySelectorAll(".remover-btn").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        removerProduto(index);
      });
    });
  }

  function removerProduto(index) {
    const produtoRemovido = carrinho[index];
    carrinho.splice(index, 1); 
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
    
    // Feedback visual na lista de produtos
    const botaoProduto = document.querySelector(`.adicionar-btn[data-id="${produtoRemovido.id}"]`);
    if (botaoProduto) {
      botaoProduto.disabled = false;
      botaoProduto.textContent = "Adicionar ao Cesto";
    }
    
    // Dispatch event to update the counter
    document.dispatchEvent(new CustomEvent('carrinhoAtualizado'));
  }

  // Add empty cart functionality
  esvaziarBtn.addEventListener("click", () => {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      carrinho = [];
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      renderCarrinho();
      
      // Resetar todos os botões de adicionar
      document.querySelectorAll('.adicionar-btn').forEach(botao => {
        botao.disabled = false;
        botao.textContent = "Adicionar ao Cesto";
      });
      
      // Dispatch event to update the counter
      document.dispatchEvent(new CustomEvent('carrinhoAtualizado'));
    }
  });

  renderCarrinho();
});
