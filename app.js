const playerData = {
    gold: 962, silver: 99, copper: 96, diamonds: 458.25,
    hp: 338, max_hp: 663, mp: 327, max_mp: 327
};

function initGame() {
    // Деньги
    document.getElementById('gold-val').innerText = playerData.gold;
    document.getElementById('silver-val').innerText = playerData.silver;
    document.getElementById('copper-val').innerText = playerData.copper;
    document.getElementById('diamonds-val').innerText = playerData.diamonds;

    // Полоски
    const hpWidth = (playerData.hp / playerData.max_hp) * 100;
    document.getElementById('hp-bar').style.width = hpWidth + "%";
    
    const mpWidth = (playerData.mp / playerData.max_mp) * 100;
    document.getElementById('mp-bar').style.width = mpWidth + "%";

    console.log("Интерфейс инициализирован.");
}

window.onload = initGame;