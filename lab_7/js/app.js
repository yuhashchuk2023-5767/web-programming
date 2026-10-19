// Вставте сюди вашу унікальну адресу endpoint з MockAPI
const API_URL = "https://6ad62836f71f154ac4868f91.mockapi.io/sensors";
/**
 * Функція асинхронного завантаження даних із сервера
 */
async function loadSensors() {
  const container = document.querySelector("#sensors-list");
  
  try {
    container.innerHTML = "<p>Завантаження даних з сервера...</p>";
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! статус: ${response.status}`);
    }
    
    const sensors = await response.json();
    renderSensors(sensors);
    
  } catch (error) {
    console.error("Не вдалося завантажити сенсори:", error);
    container.innerHTML = `<p class="error-msg">⚠️ Не вдалося завантажити дані з сервера. Перевірте з'єднання.</p>`;
  }
}

/**
 * Функція відображення масиву сенсорів у DOM
 */
function renderSensors(sensors) {
  const container = document.querySelector("#sensors-list");
  container.innerHTML = ""; // Очищуємо контейнер

  if (sensors.length === 0) {
    container.innerHTML = "<p>Список сенсорів порожній.</p>";
    return;
  }

  sensors.forEach((sensor) => {
    const card = document.createElement("article");
    card.classList.add("sensor-card");
    
    card.innerHTML = `
      <h3>${sensor.name}</h3>
      <p>📍 <strong>Район:</strong> ${sensor.district}</p>
      <p>🔊 <strong>Рівень шуму:</strong> ${sensor.noiseLevel} дБ</p>
      <p>⚡ <strong>Статус:</strong> ${sensor.status}</p>
    `;
    
    container.append(card);
  });
}

// Запуск завантаження при відкритті сторінки
document.addEventListener("DOMContentLoaded", () => {
  loadSensors();
});