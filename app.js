const tg = window.Telegram.WebApp;
tg.expand();

const SUPABASE_URL = 'https://cxoswjkqwuhribsgpcbq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FJOaGKCTBOb4Oq8JGKZIeA_w1lYQ7y-'; // Твой ключ

let player = {
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id.toString() : "test_user",
    nickname: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Скиф",
    level: 1, exp: 0, gold: 100, 
    valour: 0, energy: 100, // Доблесть и Энергия
    hp: 663, max_hp: 663, 
    mp: 327, max_mp: 327,
    base_stats: { str: 10, dex: 10, def: 10, luck: 5 },
    inventory: [],
    equipment: { head: null, weapon: null, chest: null, legs: null, boots: null },
    style: "universal" // tank, dodger, critter
};

async function loadPlayerData() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        if (data.length > 0) {
            player = data[0];
            if (!player.equipment) player.equipment = { head: null, weapon: null, chest: null, legs: null, boots: null };
        } else {
            await createNewPlayer();
        }
        updateUI();
    } catch (e) { console.error("Ошибка сети:", e); }
}

async function createNewPlayer() {
    await fetch(`${SUPABASE_URL}/rest/v1/players`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(player)
    });
}

function updateUI() {
    document.getElementById('hp-text').innerText = `${player.hp}/${player.max_hp}`;
    document.getElementById('hp-bar').style.width = (player.hp / player.max_hp * 100) + "%";
    document.getElementById('mp-text').innerText = `${player.mp}/${player.max_mp}`;
    document.getElementById('mp-bar').style.width = (player.mp / player.max_mp * 100) + "%";
    document.getElementById('en-text').innerText = `${player.energy}/100`;
    document.getElementById('en-bar').style.width = player.energy + "%";
    document.getElementById('level-orb').innerText = player.level;
}

function changeTab(tab) {
    const log = document.getElementById('log-window');
    if (tab === 'hunt') {
        log.innerHTML = "🏕 <b>Режим охоты</b><br>Здесь вы встретите монстров Астерии. <button onclick='startBattle()'>Начать бой</button>";
    } else if (tab === 'stats') {
        log.innerHTML = `🛡 <b>${player.nickname}</b><br>Стиль: ${player.style}<br>Доблесть: ${player.valour}<br>Сила: ${player.base_stats.str}`;
    } else if (tab === 'inv') {
        log.innerHTML = "👜 <b>Ваш рюкзак</b><br>" + (player.inventory.length ? "Список вещей..." : "Пусто.");
    }
}

// Запуск
loadPlayerData();