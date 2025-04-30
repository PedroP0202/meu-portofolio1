let btnMenu = document.getElementById('btn-menu');
let menu = document.getElementById('menu-mobile');
let overlay = document.getElementById('overlay-menu');
btnMenu.addEventListener('click', ()=> {

    menu.classList.add('menu-mobile-show');
   
});

menu.addEventListener('click', ()=> {
    menu.classList.remove('menu-mobile-show');
});
overlay.addEventListener('click', ()=> {
    menu.classList.remove('menu-mobile-show');
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const targetId = this.getAttribute('href').substring(1); // Pega o ID do link
      const targetElement = document.getElementById(targetId);
  
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'  // Isso garante que o scroll seja suave
      });
    });
  });
  
//   setTimeout(() => {
//     window.scrollTo({top: targetElement.offsetTop, behavior: "smooth"});
// }, 100); // Adiciona um pequeno delay de 100ms

window.addEventListener('scroll', () => {
  const section = document.getElementById('projetos');
  const texto = document.getElementById('texto-f');
  if (!section || !texto) return;

  const scrollTop = window.scrollY;
  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const sectionBottom = sectionTop + sectionHeight;

  if (scrollTop < sectionTop) {
    texto.style.opacity = 0; // Antes da section → invisível

  } else if (scrollTop > sectionBottom) {
    texto.style.opacity = 0; // Depois da section → invisível
  } else {
    // Dentro da section → opacidade de 0 a 1 até ao meio, depois de 1 a 0

    const progress = (scrollTop - sectionTop) / sectionHeight;
    let opacity;
    if (progress < 0.1) {
      opacity = progress * 5; // De 0 a 1
    } else {
      opacity = (1 - progress) * 1; // De 1 a 0
    }
    // Faz fade in e depois fade out
    texto.style.opacity = opacity;
  }
});

