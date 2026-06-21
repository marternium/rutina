console.log("SCRIPT CARGADO");
const today = new Date().toISOString().split("T")[0];
document.getElementById("eventDate").value = today;

let data = JSON.parse(localStorage.getItem("agendaMar"));

if (!data) {
    data = {
        xp: 0,
        events: [],
        lastDate: today
    };
}

if (data.lastDate !== today) {

    const newEvents = generateDailyEvents();

    data.events = [
        ...newEvents
    ];

    data.lastDate = today;
}

function generateDailyEvents() {

    const day = new Date().getDay();

    const base = [
        { time: "08:00", title: "🌅 Despertarse", type: "life" },

        { time: "08:05", title: "💊 Tomar medicamentos", type: "life" },

        { time: "08:15", title: "🚿 Baño", type: "life" },

        { time: "09:00", title: "🍳 Desayuno", type: "life" },

        { time: "14:30", title: "🍽️ Almuerzo", type: "life" },

        { time: "18:00", title: "☕ Merienda", type: "life" },

        { time: "22:00", title: "🍲 Cena", type: "life" },

        { time: "23:00", title: "🌙 Dormir", type: "life" }
    ];

    const work = [
        { time: "10:00", title: "💻 Trabajo", type: "work", days: [1, 2, 3, 4, 5] }
    ];

    const study = [
        { time: "10:00", title: "📚 Estudiar", type: "study", days: [0, 6] }
    ];

    return [
        ...base,
        ...work.filter(e => !e.days || e.days.includes(day)),
        ...study.filter(e => !e.days || e.days.includes(day))
    ].map(e => ({
        ...e,
        date: today,
        done: false
    }));
}

function save() {
    localStorage.setItem("agendaMar", JSON.stringify(data));
}

function render() {

    const container = document.getElementById("schedule");
    container.innerHTML = "";

    const events = data.events.filter(e => e.date === today).sort((a, b) => a.time.localeCompare(b.time));

    let doneCount = 0;

    events.forEach((e) => {

        const div = document.createElement("div");
        div.className = "event";

        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        const [h, m] = e.time.split(":").map(Number);
        const eventMinutes = h * 60 + m;

        if (eventMinutes < nowMinutes) {
            div.classList.add("past");
        }

        if (Math.abs(eventMinutes - nowMinutes) < 30) {
            div.classList.add("current");
        }

        if (e.done) {
            div.classList.add("done");
        }

        const left = document.createElement("span");

        left.textContent =
            (e.done ? "✔️ " : "") +
            `${e.time} — ${e.title}`;

        div.appendChild(left);

        div.onclick = () => {

            // 🔥 SOLO sumar XP si no estaba hecho
            if (!e.done) {
                e.done = true;

                // XP según tipo
                if (e.type === "life") data.xp += 5;
                if (e.type === "work") data.xp += 15;
                if (e.type === "study") data.xp += 15;
                if (!e.type) data.xp += 10;
            } else {
                e.done = false;
                if (e.type === "life") data.xp = Math.max(0, data.xp - 5);
                else if (e.type === "work") data.xp = Math.max(0, data.xp - 15);
                else if (e.type === "study") data.xp = Math.max(0, data.xp - 15);
                else data.xp = Math.max(0, data.xp - 10);
            }

            save();
            render();
        };

        if (e.done) doneCount++;

        container.appendChild(div);
    });

    const progress = events.length
        ? Math.round((doneCount / events.length) * 100)
        : 0;

    document.getElementById("progressFill").style.width = progress + "%";
    document.getElementById("progressText").innerText =
        `${doneCount}/${events.length} tareas (${progress}%)`;

    updateXP();

    document.getElementById("date").innerText =
        new Date().toLocaleDateString("es-UY", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });

    document.getElementById("kalyText").innerText =
        getKalyMessage(progress);

    save();

    updateNowNext(events);
    renderUpcoming();
}

function updateXP() {

    const level = Math.floor(data.xp / 100) + 1;
    const xp = data.xp % 100;

    document.getElementById("level").innerText = level;

    document.getElementById("xpFill").style.width = xp + "%";

    document.getElementById("xpText").innerText =
        `${xp}/100 XP`;

    document.getElementById("title").innerText =
        getTitle(level);
}

function getTitle(l) {

    if (l >= 20) return "Reina del Caos Productivo";
    if (l >= 10) return "Domadora de Bugs";
    if (l >= 5) return "Aprendiz disciplinada";
    return "Novata del Orden";
}

function getKalyMessage(p) {

    if (p >= 80) return "😇 Kaly está orgullosa de ti.";
    if (p >= 50) return "😐 Vas bien… no destruyo nada todavía.";
    if (p >= 20) return "😏 Hmmm… interesante nivel de caos.";
    return "😈 Estoy evaluando si muerdo la puerta.";
}

function addEvent() {

    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("time").value;

    if (!title || !date || !time) return;
    

    data.events.push({
        title,
        date,
        time,
        type: "custom",
        done: false
    });

    save();
    render();
}

render();

function updateNowNext(events) {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parsed = events.map(e => {

        const [h, m] = e.time.split(":").map(Number);

        return {
            ...e,
            minutes: h * 60 + m
        };
    }).sort((a, b) => a.minutes - b.minutes);

    let current = null;
    let next = null;

    for (let e of parsed) {

        if (e.minutes <= currentMinutes) {
            current = e;
        }

        if (e.minutes > currentMinutes && !next) {
            next = e;
        }
    }

    document.getElementById("nowEvent").innerText =
        current ? `${current.time} ${current.title}` : "Nada ahora";

    document.getElementById("nextEvent").innerText =
        next ? `${next.time} ${next.title}` : "Nada después";
}

function renderUpcoming(){

    const container = document.getElementById("upcoming");
    container.innerHTML = "";

    const upcoming = data.events
        .filter(e => e.date > today)
        .sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    if(upcoming.length === 0){
        container.innerHTML = "<p>No hay eventos futuros</p>";
        return;
    }

    upcoming.forEach(e => {

        const div = document.createElement("div");
        div.className = "event";

        const dateFormatted = new Date(e.date).toLocaleDateString("es-UY");

        div.innerHTML = `
            <span>📌 ${dateFormatted} ${e.time} — ${e.title}</span>
        `;

        container.appendChild(div);
    });
}