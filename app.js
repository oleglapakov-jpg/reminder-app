const squatInterval = 45 * 60 * 1000;
const waterInterval = 60 * 60 * 1000;

let escalationTimers = [];

function isWorkingTime() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday

  if (day === 0 || day === 6) return false;

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const current = hours * 60 + minutes;
  const start = 9 * 60;
  const end = 17 * 60 + 30;

  return current >= start && current <= end;
}

function logAction(text) {
  const log = document.getElementById("log");
  const li = document.createElement("li");
  li.textContent = text + " — " + new Date().toLocaleTimeString();
  log.prepend(li);
}

function clearEscalation() {
  escalationTimers.forEach(clearTimeout);
  escalationTimers = [];
}

function escalate(message) {
  clearEscalation();

  for (let i = 1; i <= 5; i++) {
    const t = setTimeout(() => {
      showNotification("Напоминание: " + message);
    }, i * 60000);
    escalationTimers.push(t);
  }
}

function showNotification(message) {
  if (Notification.permission !== "granted") return;

  const n = new Notification(message);

  n.onclick = () => {
    logAction("Выполнено: " + message);
    clearEscalation();
  };

  escalate(message);
}

function getNextTimes() {
  const now = new Date();

  let squatNext = new Date(now);
  let waterNext = new Date(now);

  squatNext.setSeconds(0);
  waterNext.setSeconds(0);

  squatNext.setMilliseconds(0);
  waterNext.setMilliseconds(0);

  squatNext.setMinutes(
    Math.ceil(now.getMinutes() / 45) * 45
  );

  waterNext.setMinutes(
    Math.ceil(now.getMinutes() / 60) * 60
  );

  return { squatNext, waterNext };
}

function scheduleLoop() {
  setInterval(() => {
    if (!isWorkingTime()) return;

    const now = new Date();
    const minutes = now.getMinutes();

    const squatOn = document.getElementById("squatToggle").checked;
    const waterOn = document.getElementById("waterToggle").checked;

    let messages = [];

    if (squatOn && minutes % 45 === 0) {
      messages.push("Сделать 10 приседаний");
    }

    if (waterOn && minutes % 60 === 0) {
      messages.push("Выпить 1 стакан воды");
    }

    if (messages.length > 0) {
      const finalMessage = messages.join(" + ");
      showNotification(finalMessage);
    }

  }, 60000);
}

function requestPermission() {
  Notification.requestPermission();
}

requestPermission();
scheduleLoop();