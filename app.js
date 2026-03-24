const tg = window.Telegram.WebApp;
tg.expand();

const SUPABASE_URL = 'https://cxoswjkqwuhribsgpcbq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FJOaGKCTBOb4Oq8JGKZIeA_w1lYQ7y-';

// Состояние игрока
let player = {
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id.toString() : "test_user",
    nickname: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Игрок",
    gold: 0,
    level: 1
};

// Список монстров
const monsters = [
    { name: "Чумная крыса", gold: 15, chance: 0.8 },
    { name: "Скелет-разведчик", gold: 40, chance: 0.6 },
    { name: "Болотный ползун", gold: 70, chance: 0.4 }
];

// 1. Загрузка данных
async function loadPlayerData() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();

        if (data.length > 0) {
            player = data[0];
        } else {
            await createNewPlayer();
        }
        updateUI();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

// 2. Создание игрока
async function createNewPlayer() {
    await fetch(`${SUPABASE_URL}/rest/v1/players`, {
        method: 'POST',
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: player.user_id,
            nickname: player.nickname,
            gold: 100,
            level: 1
        })
    });
}

// 3. Сохранение данных
async function savePlayerData() {
    await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        method: 'PATCH',
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            gold: player.gold,
            level: player.level
        })
    });
    updateUI();
}

// 4. Обновление интерфейса
function updateUI() {
    document.getElementById('nickname').innerText = player.nickname;
    document.getElementById('gold').innerText = player.gold;
    document.getElementById('level-badge').innerText = "LVL " + player.level;
}

// 5. ЛОГИКА БОЯ (Главное!)
function startBattle() {
    const log = document.getElementById('log');
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    
    log.innerHTML = `🔎 Ищем врага в зарослях...`;

    // Через 1 секунду находим врага
    setTimeout(() => {
        log.innerHTML = `⚔️ Вы встретили: <b>${monster.name}</b>! Бой начался...`;
        
        // Через 2 секунды результат боя
        setTimeout(() => {
            const isWin = Math.random() < monster.chance;

            if (isWin) {
                player.gold += monster.gold;
                log.innerHTML = `✅ Победа! Вы одолели <b>${monster.name}</b>.<br>Добыча: 💰 ${monster.gold} золота.`;
                savePlayerData();
            } else {
                log.innerHTML = `❌ <b>${monster.name}</b> оказался слишком силен. Вы сбежали!`;
            }
        }, 2000);
    }, 1000);
}

// 6. Переключение вкладок
function changeTab(tabName) {
    const log = document.getElementById('log');
    
    if (tabName === 'battle') {
        startBattle();
    } else if (tabName === 'inv') {
        log.innerText = "Рюкзак пуст. Найдите снаряжение в бою.";
    } else if (tabName === 'stats') {
        log.innerHTML = `👤 <b>${player.nickname}</b><br>Уровень: ${player.level}<br>Золото: ${player.gold}`;
    } else if (tabName === 'shop') {
        log.innerText = "Магазин закрыт на переучет.";
    }
}

// Промокоды
function usePromo() {
    const code = prompt("Введите код:");
    if (code === "DIS_SCYTH") {
        player.gold += 1000;
        alert("Бонус активирован!");
        savePlayerData();
    }
}

// Запуск игры
loadPlayerData();