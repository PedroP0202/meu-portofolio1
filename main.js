const API_TIME = 'https://worldtimeapi.org/api/timezone/Europe/Lisbon';
const API_WEATHER = 'https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current_weather=true';

const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const weatherEl = document.getElementById('weather');
let offset = 0;

function initClock() {
  fetch(API_TIME)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao obter hora');
      return res.json();
    })
    .then(data => {
      const serverDate = new Date(data.datetime);
      offset = serverDate.getTime() - Date.now();
      setInterval(updateClock, 1000);
      updateClock();
      updateWeather();
      setInterval(updateWeather, 30 * 60 * 1000);
    })
    .catch(err => {
      console.error(err);
      if (clockEl) clockEl.textContent = 'Erro ao obter hora';
    });
}

function updateClock() {
  if (!clockEl || !dateEl) return;
  const now = new Date(Date.now() + offset);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}`;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('pt-PT', options);
}

function updateWeather() {
  if (!weatherEl) return;
  fetch(API_WEATHER)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao obter clima');
      return res.json();
    })
    .then(data => {
      const temp = data.current_weather.temperature;
      weatherEl.textContent = ` ${temp}°C `;
    })
    .catch(err => {
      console.warn('Não foi possível obter o clima agora.');
      weatherEl.textContent = 'Clima indisponível';
    });
}

// ==========================================
// GLOBAL MOUSE REACTIVITY (SPOTLIGHT)
// ==========================================
const mouseGlow = document.querySelector('[data-mouse-glow]');

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

if (mouseGlow) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    const lerpFactor = 0.08; // Very soft, fluid follow
    glowX += (mouseX - glowX) * lerpFactor;
    glowY += (mouseY - glowY) * lerpFactor;

    mouseGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
}

// ==========================================
// HERO PARALLAX EFFECT
// ==========================================
const heroSection = document.getElementById('inicio');
const heroTitleGroup = document.querySelector('.split-left');

if (heroSection && heroTitleGroup) {
  heroSection.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    heroTitleGroup.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroTitleGroup.style.transition = 'transform 0.6s ease-out';
    heroTitleGroup.style.transform = 'translate3d(0, 0, 0)';
  });

  heroSection.addEventListener('mouseenter', () => {
    heroTitleGroup.style.transition = 'none';
  });
}

initClock();
