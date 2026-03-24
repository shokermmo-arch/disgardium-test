const tg = window.Telegram.WebApp;
tg.expand();

const SUPABASE_URL = 'https://cxoswjkqwuhribsgpcbq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FJOaGKCTBOb4Oq8JGKZIeA_w1lYQ7y-';

let player = {
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id.toString() : "test_user",
    nickname: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Игрок",
    gold: 0,
    level: 1,
    inventory: [] // На будущее для хранения вещей
};

// Список возможного лута
const lootTable = [
    { name: "Ржавый нож", type: "weapon", power: 2, chance: 0.3 },
    { name: "Обноски раба", type: "armor", defense: 1, chance: 0.3 },
    { name: "Кольцо Скифа", type: "accessory", power: 5, chance: 0.05 }
];

const monsters = [
    { name: "Чумная крыса", hp: 20, attack: 2, gold: 15 },
    { name: "Скелет-разведчик", hp: 40, attack: 5, gold: 40 },
    { name: "Болотный ползун", hp: 60, attack: 8, gold: 70 }
];

async function loadPlayerData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await response.json();
    if (data.length > 0) { player = data[0]; } 
    else { await createNewPlayer(); }
    updateUI();
}

async function createNewPlayer() {
    await fetch(`${SUPABASE_URL}/rest/v1/players`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: player.user_id, nickname: player.nickname, gold: 100, level: 1 })
    });
}

async function savePlayerData() {
    await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        method: 'PATCH',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ gold: player.gold, level: player.level })
    });
    updateUI();
}

function updateUI() {
    document.getElementById('nickname').innerText = player.nickname;
    document.getElementById('gold').innerText = player.gold;
    document.getElementById('level-badge').innerText = "LVL " + player.level;
}

function startBattle() {
    const log = document.getElementById('log');
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    log.innerHTML = `⚔️ Бой с <b>${monster.name}</b>...`;

    setTimeout(() => {
        if (Math.random() > 0.2) {
            player.gold += monster.gold;
            let lootMsg = "";
            
            // Шанс на выпадение вещи
            const drop = lootTable.find(item => Math.random() < item.chance);
            if (drop) {
                lootMsg = `<br>🎁 Выбили: <b>${drop.name}</b>!`;
                // Тут будет логика сохранения в инвентарь
            }

            log.innerHTML = `✅ Убит <b>${monster.name}</b>!<br>Золото: +${monster.gold}${lootMsg}`;
            savePlayerData();
        } else {
            log.innerHTML = `❌ Вы проиграли бой...`;
        }
    }, 1000);
}

function changeTab(tabName) {
    const log = document.getElementById('log');
    if (tabName === 'battle') {
        startBattle();
    } else if (tabName === 'inv') {
        log.innerText = "В сумке пусто (система инвентаря в разработке)";
    } else if (tabName === 'stats') {
        log.innerText = `Игрок: ${player.nickname} | Золото: ${player.gold}`;
    }
} // <--- ВОТ ЭТА СКОБКА БЫЛА ПОТЕРЯНА

function usePromo() {
    const code = prompt("Введите промокод:");
    if (code === "DIS_SCYTH") {
        player.gold += 1000;
        alert("Превентив одобряет! +1000 золота.");
        savePlayerData();
    } else if (code === "ADMIN_LVL") {
        player.level += 1;
        alert("Уровень повышен!");
        savePlayerData();
    } else {
        alert("Код не найден.");
    }
}

loadPlayerData();