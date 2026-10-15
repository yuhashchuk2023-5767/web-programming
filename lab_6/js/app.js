// Масив сенсорів для демонстрації DOM-фільтрації
const sensors = [
  {
    id: "NS-01",
    district: "Галицький",
    location: "просп. Свободи, 14",
    noiseLevel: 52,
    status: "normal"
  },
  {
    id: "NS-02",
    district: "Франківський",
    location: "вул. Наукова, 8",
    noiseLevel: 68,
    status: "warning"
  },
  {
    id: "NS-03",
    district: "Шевченківський",
    location: "просп. Чорновола, 21",
    noiseLevel: 83,
    status: "critical"
  },
  {
    id: "NS-04",
    district: "Сихівський",
    location: "вул. Зелена, 102",
    noiseLevel: 49,
    status: "normal"
  },
  {
    id: "NS-05",
    district: "Личаківський",
    location: "вул. Пасічна, 30",
    noiseLevel: 71,
    status: "warning"
  },
  {
    id: "NS-06",
    district: "Залізничний",
    location: "вул. Городоцька, 155",
    noiseLevel: 86,
    status: "critical"
  }
];

// 1. Пошук необхідних DOM-елементів через querySelector
const sensorList = document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

// 2. Функція створення окремої картки сенсора
function createSensorCard(sensor) {
  const card = document.createElement("article");
  card.classList.add("sensor-card", `sensor-card--${sensor.status}`);

  // Верхній рядок: ID та бейдж статусу
  const cardTop = document.createElement("div");
  cardTop.className = "card-top";

  const title = document.createElement("h3");
  title.textContent = sensor.id;

  const badge = document.createElement("span");
  badge.className = `status-badge ${sensor.status}`;
  badge.textContent = sensor.status;

  cardTop.append(title, badge);

  // Район
  const district = document.createElement("p");
  district.innerHTML = `📍 <span>${sensor.district} район</span>`;

  // Локація (адреса)
  const location = document.createElement("p");
  location.innerHTML = `🏢 <span>${sensor.location}</span>`;

  // Рівень шуму
  const level = document.createElement("p");
  level.innerHTML = `🔊 Рівень шуму: <span class="noise-val">${sensor.noiseLevel} дБ</span>`;

  // Збираємо все у картку
  card.append(cardTop, district, location, level);
  return card;
}

// 3. Функція відображення масиву сенсорів
function renderSensors(sensorArray) {
  sensorList.replaceChildren(); // Очищуємо контейнер безпечним методом
  
  sensorArray.forEach((sensor) => {
    const card = createSensorCard(sensor);
    sensorList.append(card);
  });
}

// 4. Функція застосування фільтрів
function applyFilters() {
  const selectedDistrict = districtFilter.value;
  const criticalOnly = criticalFilter.checked;

  const filteredSensors = sensors.filter((sensor) => {
    const matchesDistrict = selectedDistrict === "all" || sensor.district === selectedDistrict;
    const matchesStatus = !criticalOnly || sensor.status === "critical";

    return matchesDistrict && matchesStatus;
  });

  renderSensors(filteredSensors);
}

// 5. Підписка на події зміни фільтрів
districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

// 6. Початковий рендер усіх сенсорів при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  renderSensors(sensors);
});