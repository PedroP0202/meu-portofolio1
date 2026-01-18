const API_TIME = 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Lisbon';
const API_WEATHER = 'https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current_weather=true';

const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const weatherEl = document.getElementById('weather');
let offset = 0;

function initClock() {
  // ----- hora -----
  fetch(API_TIME)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao obter hora');
      return res.json();
    })
    .then(data => {
      const serverDate = new Date(
        `${data.year}-${data.month}-${data.day} ${data.hour}:${data.minute}:${data.seconds}`
      );

      offset = serverDate.getTime() - Date.now();

      setInterval(updateClock, 1000);
      updateClock();


      updateWeather();


      setInterval(updateWeather, 30 * 60 * 1000);
    })
    .catch(err => {
      console.error(err);
      clockEl.textContent = 'Erro ao obter hora';
    });
}

function updateClock() {
  const now = new Date(Date.now() + offset);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}`;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('pt-PT', options);
}

function updateWeather() {
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

initClock();
