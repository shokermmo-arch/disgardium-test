// Данные игрока (в будущем будут грузиться из Supabase)
let player = {
    nickname: "Сволочь",
    level: 6,
    hp: 338,
    max_hp: 663,
    mp: 327,
    max_mp: 327,
    exp: 81299,
    max_exp: 202500,
    gold: 962,
    silver: 99,
    copper: 96,
    diamonds: 458.25
};

// Функция переключения вкладок
function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Логика переключения
    if (tabName === 'inventory') {
        document.getElementById('tab-inventory').classList.add('active');
        document.getElementById('location-title').innerText = "Рюкзак";
        renderInventory();
    } else if (tabName === 'location') {
        document.getElementById('tab-location').classList.add('active');
        document.getElementById('location-title').innerText = "Центральная Площадь";
    }
}

// Обновление полосок и цифр на экране
function updateUI() {
    // Числа
    document.getElementById('gold-val').innerText = player.gold;
    document.getElementById('silver-val').innerText = player.silver;
    document.getElementById('copper-val').innerText = player.copper;
    document.getElementById('diamonds-val').innerText = player.diamonds;

    // Полоски (расчет % ширины)
    const hpPercent = (player.hp / player.max_hp) * 100;
    document.getElementById('hp-bar').style.width = hpPercent + "%";

    const mpPercent = (player.mp / player.max_mp) * 100;
    document.getElementById('mp-bar').style.width = mpPercent + "%";
}

// Заглушка для отрисовки рюкзака
function renderInventory() {
    const inv = document.getElementById('inventory-list');
    inv.innerHTML = ""; // Очистка
    for (let i = 0; i < 20; i++) {
        let slot = document.createElement('div');
        slot.className = 'item-slot';
        inv.appendChild(slot);
    }
}

// Инициализация при запуске
window.onload = () => {
    updateUI();
    console.log("Векрон загружен успешно!");
};