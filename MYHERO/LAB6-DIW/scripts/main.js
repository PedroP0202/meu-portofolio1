

if (localStorage.getItem('produtos-selecionados') === null) {
  try {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
    console.log("Chave 'produtos-selecionados' inicializada no localStorage.");
  } catch (e) {
    console.error('Erro ao inicializar produtos-selecionados no localStorage', e);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log(" DOM ");

  


  carregarCestoDoLocalStorage();
  carregarProdutos(produtos);  



 
  atualizaCesto();
});
function carregarProdutos(produtos) {
 
  

  const container = document.getElementById("lista-produtos");

  if (!container) {
    console.error("não encontrado!");
    return;
  }

 
  

  container.innerHTML = "";

  produtos.forEach(produto => {
    console.log(produto);
    console.log(`ID: ${produto.id}, Título: ${produto.title}`);

    


    const artigo = criarProduto(produto);
    container.append(artigo);
  });
}

function criarProduto(produto) {

  
  const artigo = document.createElement("article");


  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;




  const descricao = document.createElement("p");
  descricao.textContent = produto.description;


  
  const preco = document.createElement("p");
  preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

 
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = 'add';
    botao.setAttribute('aria-label', `Adicionar ${produto.title} ao cesto`);
    botao.textContent = "+ Adicionar ao Cesto";
    botao.addEventListener("click", function() {
      
      adicionarProdutoAListaSelecionados(produto);
    });


    
  artigo.append(titulo, imagem, descricao, preco, botao);

 
  return artigo;
}






function obterProdutosSelecionados() {
  try {
    const raw = localStorage.getItem('produtos-selecionados');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro a ler produtos-selecionados', e);
    return [];
  }
}

function salvarProdutosSelecionados(lista) {
  try {
    localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
  } catch (e) {
    console.error('Erro a gravar produtos-selecionados', e);
  }
}

function adicionarProdutoAListaSelecionados(produto) {
  const lista = obterProdutosSelecionados();

 
  const existente = lista.find(p => p.id === produto.id);
  if (existente) {
  


    existente.count = (existente.count || 1) + 1;
  } else {
    lista.push({ id: produto.id, title: produto.title, price: produto.price, image: produto.image, count: 1 });
  }

  salvarProdutosSelecionados(lista);
  console.log("Produto adicionado a 'produtos-selecionados':", produto.id);
 
  

  atualizaCesto();
}


function atualizaCesto() {

  

  const aside = document.getElementById('cesto');
  if (!aside) return;

  let container = document.getElementById('produtos-selecionados-container');
  if (!container) {
    container = document.createElement('section');
    container.id = 'produtos-selecionados-container';
    const existing = document.getElementById('cesto-container');
    if (existing) {
      aside.insertBefore(container, existing);
    } else {
      aside.appendChild(container);
    }
  }


  

  container.innerHTML = '';

  const lista = obterProdutosSelecionados();
  if (!lista || lista.length === 0) {
    const p = document.createElement('p');
    p.style.textAlign = 'center';
    p.style.color = '#666';
    p.style.fontStyle = 'italic';
    p.textContent = 'produtos-selecionados';
    container.appendChild(p);
  
    


    atualizarTotalSelecionados(0);
    return;
  }

  lista.forEach(prod => {
    const art = criaProdutoCesto(prod);
    container.appendChild(art);
  });


  

  const total = lista.reduce((sum, p) => sum + (p.price || 0) * (p.count || 1), 0);
  atualizarTotalSelecionados(total);
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement('article');
  artigo.className = 'cesto-item';



  const img = document.createElement('img');
  img.src = produto.image;
  img.alt = produto.title;


  const titulo = document.createElement('h4');
  titulo.textContent = produto.title;
  titulo.className = 'cesto-title';



  const qty = document.createElement('p');
  qty.textContent = `Quantidade: ${produto.count || 1}`;
  qty.className = 'cesto-qty';

  const preco = document.createElement('p');
  preco.textContent = `Preço: €${((produto.price || 0) * (produto.count || 1)).toFixed(2)}`;
  preco.className = 'cesto-price';

  const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
  btnRemover.className = 'remove small';
    btnRemover.setAttribute('aria-label', `Remover ${produto.title} da lista de selecionados`);
    btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', function() {
 


    const lista = obterProdutosSelecionados();
    const idx = lista.findIndex(p => p.id === produto.id);
    if (idx > -1) {
      lista.splice(idx, 1);
      salvarProdutosSelecionados(lista);
 
      atualizaCesto();
    }
  });

  artigo.append(img, titulo, qty, preco, btnRemover);
  return artigo;
}

function atualizarTotalSelecionados(valor) {

  const aside = document.getElementById('cesto');
  if (!aside) return;
  let totalEl = document.getElementById('total-produtos-selecionados');
  if (!totalEl) {
    totalEl = document.createElement('p');
    totalEl.id = 'total-produtos-selecionados';
    totalEl.style.fontWeight = '600';
    totalEl.style.marginTop = '1rem';

    

    aside.appendChild(totalEl);
  }
  totalEl.textContent = `Total: €${(valor || 0).toFixed(2)}`;
}


//localStorage


const CESTO_KEY = 'cesto';
let cesto = []; 

function salvarCestoNoLocalStorage() {
  try {
    localStorage.setItem(CESTO_KEY, JSON.stringify(cesto));
  } catch (e) {
    console.error('Erro ao salvar o cesto no localStorage', e);
  }
}

function carregarCestoDoLocalStorage() {
  try {
    const raw = localStorage.getItem(CESTO_KEY);
    if (raw) {
      cesto = JSON.parse(raw);
      console.log('Cesto carregado do localStorage:', cesto);
    } else {
      cesto = [];
    }
  } catch (e) {
    console.error('Erro ao ler o cesto do localStorage', e);
    cesto = [];
  }
  renderizarCesto();
}

function adicionarAoCesto(produto) {
 
  const existente = cesto.find(item => item.id === produto.id);
  if (existente) {
    existente.quantity += 1;
  } else {
    cesto.push({
      id: produto.id,
      title: produto.title,
      price: produto.price,
      image: produto.image,
      quantity: 1
    });
  }
  salvarCestoNoLocalStorage();
  renderizarCesto();
}

function removerDoCesto(produtoId) {
  cesto = cesto.filter(item => item.id !== produtoId);
  salvarCestoNoLocalStorage();
  renderizarCesto();
}

function renderizarCesto() {
  const container = document.getElementById('cesto-container');
  if (!container) return;

  container.innerHTML = '';

  if (!cesto || cesto.length === 0) {
    const p = document.createElement('p');
    p.style.textAlign = 'center';
    p.style.color = '#666';
    p.style.fontStyle = 'italic';
    p.textContent = 'O seu cesto está vazio';
    container.appendChild(p);
    return;
  }

  cesto.forEach(item => {
    const artigo = document.createElement('article');
    artigo.className = 'cesto-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;

    const titulo = document.createElement('h4');
    titulo.textContent = item.title;

    const qty = document.createElement('p');
    qty.textContent = `Quantidade: ${item.quantity}`;

    const preco = document.createElement('p');
    preco.textContent = `Preço: €${(item.price * item.quantity).toFixed(2)}`;

    const btnRemover = document.createElement('button');
      btnRemover.type = 'button';
      btnRemover.className = 'remove';
      btnRemover.setAttribute('aria-label', `Remover ${item.title} do cesto`);
      btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => removerDoCesto(item.id));


    artigo.append(img, titulo, qty, preco, btnRemover);
    container.appendChild(artigo);
  });
}