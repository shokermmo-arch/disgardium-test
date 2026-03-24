// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

function changeTab(tabName) {
    const log = document.getElementById('log');
    
    if (tabName === 'battle') {
        log.innerText = "Вы ищете противника в Чумных землях...";
        // Здесь позже добавим вызов функции боя
    } else if (tabName === 'inv') {
        log.innerText = "В рюкзаке только старая куртка и хлеб.";
    } else if (tabName === 'stats') {
        log.innerText = "Угроза: Превентив (Низкая). Статы в норме.";
    } else if (tabName === 'shop') {
        log.innerText = "Торговец подозрительно смотрит на ваш кошелек.";
    }
}