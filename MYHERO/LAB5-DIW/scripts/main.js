function mudarTexto(elemento) {
  elemento.textContent = "Não devias estar aqui!!";
}

function voltarTexto(elemento) {
  elemento.textContent = "Passa aqui!!";
}


document.querySelectorAll("button.btn-cores").forEach((e) => {
    e.addEventListener("click", () => {
       
        document.body.style.backgroundColor = e.dataset.color;

        
        document.querySelector(".btn-cores-texto").textContent =
            "Cor escolhida: " + e.dataset.color;
    });
});

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
    section.color = cor;
    li.firstChild.textContent = "Escolha uma cor em inglês: ";
  }
}

let contador = 0; 

function cont() {
  contador++; 
  document.querySelector('.contador').textContent = contador; 
}


function corAleatoria() {
  const letras = '0123456789ABCDEF';
  let cor = '#';
  for (let i = 0; i < 6; i++) {
    cor += letras[Math.floor(Math.random() * 16)];
  }
  return cor;
}                          


function texto(name, age){ 
    return "Olá, o " + name + " tem " + age + " anos!";
} 



document.querySelector('form').onsubmit = (e) => {
    
    e.preventDefault() 
    const name = document.querySelector('#nome').value;
    const age = document.querySelector('#idade').value;
const  mensagem = (texto(name, age));

document.querySelector('#mensagem').textContent = mensagem;

   
};


document.querySelector('select').onchange = function() {
    document.querySelector('body').style.backgroundColor = this.value;
}



const h1 = document.querySelector('h1');
const btnAdd = document.querySelector('#btn-add');
const btnReset = document.querySelector('#btn-reset');


if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}

h1.textContent = localStorage.getItem('counter');



function incrementar() {
   
    let counter = Number(localStorage.getItem('counter'));

    counter++;

    h1.textContent = counter;
    localStorage.setItem('counter', counter);
}

function resetar() {
 
    localStorage.setItem('counter', 0);
    h1.textContent = 0;
}



btnAdd.addEventListener('click', incrementar);
btnReset.addEventListener('click', resetar);



function count() {
    const numebr = document.querySelector('.contador');
    numebr.textContent = parseInt(numebr.textContent) + 1;
}
setInterval(count, 1000);

