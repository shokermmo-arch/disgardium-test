const tg = window.Telegram.WebApp;
tg.expand();

const SUPABASE_URL = 'https://cxoswjkqwuhribsgpcbq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FJOaGKCTBOb4Oq8JGKZIeA_w1lYQ7y-';

// 1. БАЗА ПРЕДМЕТОВ С ТРЕБОВАНИЯМИ
const itemsDB = [
    { id: "heavy_axe", name: "Боевой топор", type: "weapon", rarity: "rare", str: 15, dex: -2, def: 0, hp: 0, mp: 0, req: { str: 12 }, color: "#2196f3" },
    { id: "light_boots", name: "Сапоги ветра", type: "armor", rarity: "rare", str: 0, dex: 12, def: 2, hp: 10, mp: 0, req: { dex: 10 }, color: "#2196f3" },
    { id: "mage_robe", name: "Мантия ученика", type: "armor", rarity: "common", str: 0, dex: 2, def: 5, hp: 20, mp: 40, req: { level: 2 }, color: "#9e9e9e" },
    { id: "knight_shield", name: "Ростовой щит", type: "accessory", rarity: "epic", str: 2, dex: -5, def: 25, hp: 50, mp: 0, req: { str: 10, def: 15 }, color: "#9c27b0" }
];

// 2. БАЗА МОБОВ СО СТАТАМИ
const monstersDB = [
    { name: "Лесной Разбойник", str: 12, dex: 15, def: 8, hp: 80, mp: 0, gold: 40, exp: 35 },
    { name: "Каменный Голем", str: 25, dex: 2, def: 30, hp: 150, mp: 0, gold: 100, exp: 80 },
    { name: "Теневой Убийца", str: 10, dex: 30, def: 5, hp: 60, mp: 20, gold: 120, exp: 90 }
];

let player = {
    user_id: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id.toString() : "test_user",
    nickname: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Игрок",
    gold: 0, level: 1, exp: 0,
    inventory: [],
    equipment: { weapon: null, armor: null, accessory: null },
    base_stats: { str: 10, dex: 10, def: 10, hp: 100, mp: 50, luck: 5 }
};

// Расчет финальных статов (База + Экипировка)
function getFinalStats() {
    let s = { ...player.base_stats };
    Object.values(player.equipment).forEach(item => {
        if (item) {
            s.str += item.str || 0;
            s.dex += item.dex || 0;
            s.def += item.def || 0;
            s.hp += item.hp || 0;
            s.mp += item.mp || 0;
        }
    });
    return s;
}

// 3. МЕХАНИКА "КАМЕНЬ-НОЖНИЦЫ-БУМАГА"
function calculateWinChance(p, m) {
    let chance = 0.5; // Базовый 50/50

    // Сила бьет Защиту
    if (p.str > m.def) chance += 0.2;
    if (m.str > p.def) chance -= 0.2;

    // Защита бьет Ловкость
    if (p.def > m.dex) chance += 0.2;
    if (m.def > p.dex) chance -= 0.2;

    // Ловкость бьет Силу
    if (p.dex > m.str) chance += 0.2;
    if (m.dex > p.str) chance -= 0.2;

    return Math.max(0.1, Math.min(0.9, chance)); // Ограничение шанса от 10% до 90%
}

// 4. ПРОВЕРКА ТРЕБОВАНИЙ ДЛЯ ОДЕЖДЫ
function canEquip(item) {
    const s = getFinalStats();
    if (!item.req) return true;
    if (item.req.level && player.level < item.req.level) return false;
    if (item.req.str && s.str < item.req.str) return false;
    if (item.req.dex && s.dex < item.req.dex) return false;
    if (item.req.def && s.def < item.req.def) return false;
    return true;
}

async function savePlayerData() {
    await fetch(`${SUPABASE_URL}/rest/v1/players?user_id=eq.${player.user_id}`, {
        method: 'PATCH',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(player)
    });
    updateUI();
}

function equipItem(index) {
    const item = player.inventory[index];
    if (canEquip(item)) {
        if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
        player.equipment[item.type] = item;
        player.inventory.splice(index, 1);
        savePlayerData();
        alert("Экипировано!");
    } else {
        alert("Недостаточно характеристик!");
    }
}

function startBattle() {
    const log = document.getElementById('log');
    const pStats = getFinalStats();
    const monster = monstersDB[Math.floor(Math.random() * monstersDB.length)];
    
    log.innerHTML = `⚔️ Бой: <b>${player.nickname}</b> vs <b>${monster.name}</b>...`;

    setTimeout(() => {
        const winChance = calculateWinChance(pStats, monster);
        const roll = Math.random();

        if (roll < winChance) {
            player.gold += monster.gold;
            player.exp += monster.exp;
            let loot = "";
            if (Math.random() < 0.2) {
                const drop = itemsDB[Math.floor(Math.random() * itemsDB.length)];
                player.inventory.push(drop);
                loot = `<br>🎁 Лут: <b style="color:${drop.color}">${drop.name}</b>`;
            }
            log.innerHTML = `✅ ПОБЕДА! (Шанс был: ${Math.round(winChance*100)}%)<br>💰 +${monster.gold} 🧬 +${monster.exp}${loot}`;
            
            // Левелап дает +2 к случайному стату
            if (player.exp >= player.level * 100) {
                player.level++;
                player.exp = 0;
                const stats = ['str', 'dex', 'def'];
                const randomStat = stats[Math.floor(Math.random() * stats.length)];
                player.base_stats[randomStat] += 2;
                alert(`Уровень UP! Ваши навыки в ${randomStat} выросли!`);
            }
            savePlayerData();
        } else {
            log.innerHTML = `💀 ВЫ ПРОИГРАЛИ! ${monster.name} оказался хитрее.`;
        }
    }, 1500);
}

function changeTab(tabName) {
    const log = document.getElementById('log');
    const s = getFinalStats();
    if (tabName === 'battle') startBattle();
    else if (tabName === 'stats') {
        log.innerHTML = `
            <b>${player.nickname} (LVL ${player.level})</b><br>
            ❤ HP: ${s.hp} | 🛡 DEF: ${s.def}<br>
            ⚔ STR: ${s.str} | 🏹 DEX: ${s.dex}<br>
            🌀 MP: ${s.mp}<br>
            ----------------<br>
            <b>Экипировано:</b><br>
            ${player.equipment.weapon ? '🗡 ' + player.equipment.weapon.name : 'Пусто'}<br>
            ${player.equipment.armor ? '🛡 ' + player.equipment.armor.name : 'Пусто'}
        `;
    } else if (tabName === 'inv') {
        let h = "<b>Инвентарь:</b><br>";
        player.inventory.forEach((item, i) => {
            h += `<button onclick="equipItem(${i})" style="color:${item.color}">[Надеть] ${item.name}</button><br>`;
        });
        log.innerHTML = h;
    }
}

// Загрузка
loadPlayerData();