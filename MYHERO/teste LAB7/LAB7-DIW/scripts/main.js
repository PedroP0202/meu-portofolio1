document.addEventListener("DOMContentLoaded", async () => {
  const produtosContainer = document.getElementById("lista-produtos");
  const contadorCarrinho = document.getElementById("contador-carrinho");
  const inputFiltro = document.getElementById("filtro-produtos");
  const selectCategoria = document.getElementById("filtro-categoria");
  const selectOrdenar = document.getElementById("ordenar-produtos");
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  let produtos = [];

  atualizaCesto();

  try {
    const resposta = await fetch("https://deisishop.pythonanywhere.com/products/");
    if (!resposta.ok) {
      throw new Error("Erro ao obter produtos");
    }

    produtos = await resposta.json();

    
    const categorias = [...new Set(produtos.map(p => p.category))];
    preencherCategorias(categorias);

    mostrarProdutos(produtos);

    // Escuta mudanças no carrinho vindas de outras partes da app (carrinho.js / checkout)
    document.addEventListener('carrinhoAtualizado', () => {
      carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      // Reaplica filtro/ordenação e atualiza os botões
      aplicarFiltroOrdenacao();
    });

  } catch (erro) {
    produtosContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }

  
  function mostrarProdutos(lista) {
    produtosContainer.innerHTML = ""; 
    lista.forEach(produto => {
      const div = document.createElement("div");
      div.classList.add("produto");

      div.innerHTML = `
        <img src="${produto.image}" alt="${produto.title}">
        <h3>${produto.title}</h3>
        <p>${produto.description}</p>
        <p class="preco">€${produto.price.toFixed(2)}</p>
        <button class="adicionar-btn" data-id="${produto.id}">Adicionar ao Cesto</button>
      `;

      const botao = div.querySelector(".adicionar-btn");
      // desabilita o botão se o produto já estiver no carrinho
      const existeNoCarrinho = carrinho.some(item => item.id === produto.id);
      if (existeNoCarrinho) {
        botao.disabled = true;
        botao.textContent = "Adicionado";
        botao.style.opacity = "0.7";
      }

      botao.addEventListener("click", () => {
        adicionarAoCesto(produto);
      });

      produtosContainer.appendChild(div);
    });
  }

  function adicionarAoCesto(produto) {
    const existe = carrinho.some(item => item.id === produto.id);
    if (!existe) {
      carrinho.push(produto);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      atualizaCesto();
     
      document.dispatchEvent(new CustomEvent('carrinhoAtualizado'));
    
      const botao = document.querySelector(`.adicionar-btn[data-id="${produto.id}"]`);
      if (botao) {
        const originalText = botao.textContent;
        botao.textContent = " ✅ Adicionado!";
        botao.style.backgroundColor = "#4CAF50";
        botao.disabled = true;
        setTimeout(() => {
          botao.textContent = originalText;
          botao.style.backgroundColor = "";
        }, 1500);
      }
    } else {
      alert('Este produto já está no carrinho!');
    }
  }

  function atualizaCesto() {
    contadorCarrinho.textContent = `Carrinho: ${carrinho.length} itens`;
  }

  function preencherCategorias(categorias) {
    selectCategoria.innerHTML = '<option value="">Todas as categorias</option>';
    categorias.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      selectCategoria.appendChild(opt);
    });
  }

  
  function getProdutosFiltrados() {
    const termo = inputFiltro.value.toLowerCase();
    const categoria = selectCategoria.value;

    return produtos.filter(p => {
      const correspondeCategoria = categoria === "" || p.category === categoria;
      const correspondeTexto =
        p.title.toLowerCase().includes(termo) ||
        p.description.toLowerCase().includes(termo);
      return correspondeCategoria && correspondeTexto;
    });
  }

  function ordenarLista(lista, criterio) {
    const copia = [...lista];
    switch (criterio) {
      case 'price-asc':
        copia.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        copia.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'title-asc':
        copia.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        copia.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return copia;
  }

  function aplicarFiltroOrdenacao() {
    const filtrados = getProdutosFiltrados();
    const criterio = selectOrdenar ? selectOrdenar.value : '';
    const ordenados = ordenarLista(filtrados, criterio);
    mostrarProdutos(ordenados);
  }

  inputFiltro.addEventListener("input", aplicarFiltroOrdenacao);
  selectCategoria.addEventListener("change", aplicarFiltroOrdenacao);
  if (selectOrdenar) selectOrdenar.addEventListener('change', aplicarFiltroOrdenacao);
});
