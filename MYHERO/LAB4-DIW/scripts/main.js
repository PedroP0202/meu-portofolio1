

function mudarTexto(elemento) {
  elemento.textContent = "Não devias estar aqui!!";
}

function voltarTexto(elemento) {
  elemento.textContent = "Passa aqui!!";
}

function mudarCor(cor) {
  const li = document.querySelector('.btn-cores-texto');
  li.style.color = cor;
}

const li = document.querySelector('.cor-ingles');
const input = li.querySelector('input');
const button = li.querySelector('button');

button.onclick = function () {
  const cor = input.value.trim();
  if (cor) {
    li.style.color = cor;
    li.firstChild.textContent = "Escolha uma cor em inglês: ";
  }
}


function corAleatoria() {
  const letras = '0123456789ABCDEF';
  let cor = '#';
  for (let i = 0; i < 6; i++) {
    cor += letras[Math.floor(Math.random() * 16)];
  }
  return cor;
}

const inpute = document.querySelector('.cores-letras input');
inpute.addEventListener('input', function () { inpute.style.backgroundColor = corAleatoria(); });

let contador = 0; l

function cont() {
  contador++; 
  document.querySelector('.contador').textContent = contador; 
}