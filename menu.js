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
        behavior: 'smooth' 
      });
    });
  });
  
  setTimeout(() => {
    window.scrollTo({top: targetElement.offsetTop, behavior: "smooth"});
}, 100); 
