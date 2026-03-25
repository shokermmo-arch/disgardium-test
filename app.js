// ... (начало кода с конфигами Supabase остается прежним)

// БАЗА ПРЕДМЕТОВ ВЕКРОНА
const itemsDB = [
    // СЕРЫЕ (Обычные) - Магазин
    { id: "v_gray_sword", name: "Меч Рекрута", type: "weapon", rarity: "gray", str: 5, color: "#9e9e9e", req: 1 },
    { id: "v_gray_chest", name: "Рубаха Странника", type: "chest", rarity: "gray", def: 3, color: "#9e9e9e", req: 1 },

    // ЗЕЛЕНЫЕ (Необычные) - Дроп с мобов
    { id: "v_green_axe", name: "Топор Налетчика", type: "weapon", rarity: "green", str: 12, dex: 2, color: "#4caf50", req: 3 },
    { id: "v_green_armor", name: "Кожаный панцирь", type: "chest", rarity: "green", def: 15, hp: 40, color: "#4caf50", req: 3 },

    // СИНИЕ (Уникальные) - За доблесть
    { id: "v_blue_blade", name: "Клинок Чести", type: "weapon", rarity: "blue", str: 25, luck: 10, color: "#2196f3", req: 5 },

    // ФИОЛЕТОВЫЕ (Редкие)
    { id: "v_purple_staff", name: "Посох Бездны", type: "weapon", rarity: "purple", str: 50, mp: 100, color: "#9c27b0", req: 7 },

    // ЗОЛОТЫЕ (Эпические) - Пик могущества
    { id: "v_gold_crown", name: "Корона Императора Векрона", type: "head", rarity: "gold", str: 100, def: 100, hp: 500, color: "#ffcc00", req: 11 }
];

// ШАНСЫ ВЫПАДЕНИЯ (Дроп-рейт)
function getRarityByRoll() {
    const roll = Math.random() * 100;
    if (roll < 0.1) return "gold";     // 0.1%
    if (roll < 1) return "purple";    // 1%
    if (roll < 5) return "blue";      // 5%
    if (roll < 20) return "green";    // 20%
    return "gray";                    // Все остальное
}

// ФУНКЦИЯ БОЯ С ЛУТОМ
async function startBattle(mobId) {
    const log = document.getElementById('log-window');
    const mob = worldData.monsters.find(m => m.id == mobId);
    
    log.innerHTML = `⚔️ <b>Бой с ${mob.name}...</b>`;

    setTimeout(async () => {
        // Упрощенная победа для теста
        player.gold += mob.gold;
        player.exp += 20;
        
        let lootMsg = "";
        // Генерируем шмот
        const rarity = getRarityByRoll();
        const possibleLoot = itemsDB.filter(i => i.rarity === rarity);
        
        if (possibleLoot.length > 0 && Math.random() < 0.3) { // 30% шанс вообще получить шмотку
            const droppedItem = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
            player.inventory.push(droppedItem);
            lootMsg = `<br>🎁 Найдено: <b style="color:${droppedItem.color}">[${droppedItem.name}]</b>`;
        }

        log.innerHTML = `✅ Победа!<br>💰 Золото: +${mob.gold}${lootMsg}`;
        
        await savePlayerData();
    }, 1500);
}

// ФУНКЦИЯ ЭКИПИРОВКИ (Одеваем на куклу)
function equipItem(index) {
    const item = player.inventory[index];
    if (player.level < (item.req || 1)) {
        alert("Уровень слишком мал!");
        return;
    }

    // Если слот занят, возвращаем вещь в инвентарь
    if (player.equipment[item.type]) {
        player.inventory.push(player.equipment[item.type]);
    }

    player.equipment[item.type] = item;
    player.inventory.splice(index, 1);
    
    savePlayerData();
    renderEquipment(); // Обновить визуал куклы
}

function renderEquipment() {
    const slots = ['head', 'weapon', 'chest', 'legs', 'boots'];
    slots.forEach(slot => {
        const item = player.equipment[slot];
        const el = document.getElementById(`slot-${slot}`);
        if (item) {
            el.style.backgroundImage = `url('https://asteriagame.com/img/items/${item.id}.png')`; // Путь к иконке
            el.style.borderColor = item.color;
            el.style.boxShadow = `0 0 5px ${item.color}`;
        } else {
            el.style.backgroundImage = 'none';
            el.style.borderColor = '#4a3828';
        }
    });
}