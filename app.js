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
}