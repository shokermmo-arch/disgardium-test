// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();

// НАСТРОЙКИ SUPABASE
const SUPABASE_URL = 'https://cxoswjkqwuhribsgpcbq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FJOaGKCTBOb4Oq8JGKZIeA_w1lYQ7y-';

// Данные игрока (временные, пока не загрузятся)
let player = {
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id.toString() : "test_user",
    nickname: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Игрок",
    gold: 0,
    level: 1
};

// Функция загрузки данных из базы
async function loadPlayerData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await response.json();

    if (data.length > 0) {
        player = data[0]; // Если игрок найден, берем его данные
    } else {
        await createNewPlayer(); // Если нет - создаем нового
    }
    updateUI();
}

// Функция создания нового игрока
async function createNewPlayer() {
    await fetch(`${SUPABASE_URL}/rest/v1/players`, {
        method: 'POST',
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({
            user_id: player.user_id,
            nickname: player.nickname,
            gold: 100,
            level: 1
        })
    });
}

// Обновление экрана
function updateUI() {
    document.getElementById('nickname').innerText = player.nickname;
    document.getElementById('gold').innerText = player.gold;
    document.getElementById('level-badge').innerText = "LVL " + player.level;
}

// Запускаем загрузку при старте
loadPlayerData();

// Функция кнопок
function changeTab(tabName) {
    const log = document.getElementById('log');
    if (tabName === 'battle') {
        log.innerText = "Вы ищете врага... (Скоро здесь будет бой!)";
    }
    // Другие табы...
}// База монстров (можно расширять)
const monsters = [
    { name: "Чумная крыса", hp: 20, attack: 2, gold: 15, exp: 10 },
    { name: "Скелет-разведчик", hp: 40, attack: 5, gold: 40, exp: 25 },
    { name: "Болотный ползун", hp: 60, attack: 8, gold: 70, exp: 50 }
];

// Функция сохранения золота в базу данных
async function savePlayerData() {
    await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        method: 'PATCH', // PATCH обновляет существующую строку
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            gold: player.gold,
            level: player.level
            // Здесь же будем обновлять HP и шмот позже
        })
    });
    updateUI();
}

// ЛОГИКА БОЯ
function startBattle() {
    const log = document.getElementById('log');
    // Выбираем случайного моба
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    
    log.innerHTML = `⚔️ Вы встретили: <b>${monster.name}</b>!`;

    // Имитация боя (пока упрощенно)
    setTimeout(() => {
        const isWin = Math.random() > 0.2; // 80% шанс на победу

        if (isWin) {
            player.gold += monster.gold;
            log.innerHTML = `✅ Победа над <b>${monster.name}</b>!<br>Получено: 💰 ${monster.gold} золота.`;
            savePlayerData(); // СОХРАНЯЕМ В БАЗУ
        } else {
            log.innerHTML = `❌ <b>${monster.name}</b> оказался сильнее. Вы отступили...`;
        }
    }, 1500); // Задержка 1.5 сек для эффекта "ожидания"
}

// Обновляем обработчик вкладок
function changeTab(tabName) {
    const log = document.getElementById('log');
    if (tabName === 'battle') {
        startBattle();
    } else if (tabName === 'inv') {
        log.innerText = "Ваш инвентарь пуст. Идите в бой!";
    } else if (tabName === 'stats') {
        log.innerText = `Герой: ${player.nickname}. Уровень: ${player.level}. Золото: ${player.gold}`;
    }
function usePromo() {
    const code = prompt("Введите промокод:"); // Всплывающее окно в Telegram
    
    if (code === "DIS_SCYTH") {
        player.gold += 1000;
        alert("Превентив одобряет! +1000 золота.");
        savePlayerData();
    } else if (code === "ADMIN_LVL") {
        player.level += 1;
        alert("Уровень повышен!");
        savePlayerData();
    } else {
        alert("Код не найден в архивах системы.");
    }
}