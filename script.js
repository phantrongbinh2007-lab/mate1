// ==========================================
// FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyD85HVvTAI_fSUqoZh_LNEjMVK5xI2D404",
    authDomain: "mate-in-1-67491.firebaseapp.com",
    projectId: "mate-in-1-67491",
    storageBucket: "mate-in-1-67491.firebasestorage.app",
    messagingSenderId: "265193843832",
    appId: "1:265193843832:web:a996a2f8fcb05aeab6918d",
    measurementId: "G-F4VH380HPN"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/** Thời gian tối thiểu (giây) — khớp firestore.rules */
const MIN_SAVE_SECONDS = 120;
const MAX_SAVE_SECONDS = 7200;

// ==========================================
// ROUTES (Đã phục hồi đủ 63 tỉnh thành)
// ==========================================
const routes = [
    { name: "Hà Giang", top: "5%", left: "45%", fact: "Cao nguyên đá Hà Giang có những ngọn núi hình thang rất đẹp như tranh vẽ." },
    { name: "Cao Bằng", top: "7%", left: "55%", fact: "Thác Bản Giốc ở Cao Bằng là một trong những thác nước đẹp nhất Việt Nam." },
    { name: "Lào Cai", top: "8%", left: "35%", fact: "Núi Fansipan ở Lào Cai cao nhất Đông Dương, gọi là nóc nhà Đông Dương." },
    { name: "Lai Châu", top: "9%", left: "25%", fact: "Lai Châu có những ruộng bậc thang uốn lượn rất đẹp trên núi cao." },
    { name: "Điện Biên", top: "12%", left: "20%", fact: "Điện Biên Phủ là nơi diễn ra trận đánh lịch sử năm 1954 của Việt Nam." },
    { name: "Sơn La", top: "15%", left: "30%", fact: "Hồ thủy điện Sơn La rộng lớn, là hồ nhân tạo lớn nhất Việt Nam." },
    { name: "Yên Bái", top: "14%", left: "40%", fact: "Hồ Thác Bà ở Yên Bái rộng như một biển nước xanh giữa núi rừng." },
    { name: "Tuyên Quang", top: "12%", left: "48%", fact: "Tuyên Quang có ATK – nơi Bác Hồ và các cụ lãnh đạo từng làm việc." },
    { name: "Bắc Kạn", top: "10%", left: "53%", fact: "Hồ Ba Bể ở Bắc Kạn là hồ nước ngọt tự nhiên lớn nhất Việt Nam." },
    { name: "Lạng Sơn", top: "12%", left: "60%", fact: "Lạng Sơn có núi Mẫu Sơn nổi tiếng, mùa đông đôi khi có tuyết rơi." },
    { name: "Thái Nguyên", top: "15%", left: "52%", fact: "Thái Nguyên nổi tiếng với chè xanh và bảo tàng các dân tộc Việt Nam." },
    { name: "Phú Thọ", top: "17%", left: "45%", fact: "Phú Thọ được gọi là cội nguồn, nơi thờ Hùng Vương – vua nước Văn Lang." },
    { name: "Hòa Bình", top: "19%", left: "42%", fact: "Hòa Bình có hồ thủy điện Hòa Bình lớn và thung lũng Mai Châu rất đẹp." },
    { name: "Vĩnh Phúc", top: "18%", left: "48%", fact: "Vĩnh Phúc có chùa Tây Phương với nhiều tượng Phật gỗ quý." },
    { name: "Hà Nội", top: "20%", left: "50%", fact: "Hà Nội là thủ đô nghìn năm văn hiến, có Hồ Gươm và phố cổ rất đẹp." },
    { name: "Bắc Giang", top: "18%", left: "56%", fact: "Bắc Giang có vùng vải thiều ngọt nổi tiếng cả nước." },
    { name: "Bắc Ninh", top: "19%", left: "54%", fact: "Bắc Ninh là quê hương của quan họ – hát call-and-response trên thuyền." },
    { name: "Quảng Ninh", top: "18%", left: "65%", fact: "Vịnh Hạ Long ở Quảng Ninh được UNESCO công nhận di sản thiên nhiên thế giới." },
    { name: "Hải Phòng", top: "22%", left: "62%", fact: "Hải Phòng là thành phố cảng lớn, có đảo Cát Bà xinh đẹp." },
    { name: "Hải Dương", top: "21%", left: "57%", fact: "Hải Dương có chùa Con Sơn – nơi thiền sư Huyền Quang từng tu hành." },
    { name: "Hưng Yên", top: "22%", left: "54%", fact: "Hưng Yên nổi tiếng với long nhãn – trái nhãn to, ngọt và thơm." },
    { name: "Hà Nam", top: "24%", left: "52%", fact: "Hà Nam có chùa Tam Chúc – quần thể chùa chiều rộng rất lớn." },
    { name: "Thái Bình", top: "25%", left: "58%", fact: "Thái Bình có biển Đồng Châu với rừng ngập mặn và bãi biển hoang sơ." },
    { name: "Nam Định", top: "26%", left: "55%", fact: "Nam Định có nhà thờ Phát Diệm – kiến trúc độc đáo kết hợp Đông Tây." },
    { name: "Ninh Bình", top: "27%", left: "50%", fact: "Ninh Bình có Tràng An – hang động và sông nước đẹp như cổ tích." },
    { name: "Thanh Hóa", top: "30%", left: "45%", fact: "Thanh Hóa có thành nhà Hồ – di tích lịch sử bằng đá rất đặc biệt." },
    { name: "Nghệ An", top: "35%", left: "40%", fact: "Nghệ An là quê hương của Bác Hồ – Chủ tịch Hồ Chí Minh kính yêu." },
    { name: "Hà Tĩnh", top: "40%", left: "45%", fact: "Hà Tình có núi Hồng Lĩnh và biển xanh, là quê của nhiều nhà thơ lớn." },
    { name: "Quảng Bình", top: "45%", left: "50%", fact: "Quảng Bình có động Phong Nha – Kẻ Bàng, hang động kỳ vĩ nhất thế giới." },
    { name: "Quảng Trị", top: "48%", left: "55%", fact: "Quảng Trị có cầu Hiền Lương – biểu tượng chia cắt và thống nhất đất nước." },
    { name: "Thừa Thiên Huế", top: "51%", left: "60%", fact: "Huế từng là kinh đô triều Nguyễn, có Đại Nội và sông Hương thơ mộng." },
    { name: "Đà Nẵng", top: "54%", left: "65%", fact: "Đà Nẵng có cầu Rồng phun lửa và bãi biển Mỹ Khê rất đẹp." },
    { name: "Quảng Nam", top: "57%", left: "62%", fact: "Quảng Nam có phố cổ Hội An – đèn lồng lung linh về đêm." },
    { name: "Quảng Ngãi", top: "60%", left: "65%", fact: "Quảng Ngãi có đảo Lý Sơn – vùng đất của tỏi và biển xanh trong." },
    { name: "Kon Tum", top: "58%", left: "55%", fact: "Kon Tum có nhà rông cao vút – biểu tượng văn hóa của các dân tộc Tây Nguyên." },
    { name: "Gia Lai", top: "63%", left: "55%", fact: "Gia Lai có biển hồ T'nưng – mặt hồ xanh như gương giữa cao nguyên." },
    { name: "Bình Định", top: "65%", left: "68%", fact: "Bình Định có tháp Chăm Bánh Ít – kiến trúc cổ hơn 900 năm tuổi." },
    { name: "Phú Yên", top: "68%", left: "70%", fact: "Phú Yên có mũi Điện Cấp – nơi ngắm bình minh đẹp nhất ven biển." },
    { name: "Đắk Lắk", top: "68%", left: "58%", fact: "Đắk Lắk có hồ Lak – hồ nước ngọt lớn giữa cao nguyên Tây Nguyên." },
    { name: "Đắk Nông", top: "72%", left: "55%", fact: "Đắk Nông có thác Dray Nur – ngọn thác hùng vĩ giữa rừng xanh." },
    { name: "Khánh Hòa", top: "72%", left: "72%", fact: "Khánh Hòa có vịnh Nha Trang xinh đẹp với nhiều hòn đảo nhỏ." },
    { name: "Lâm Đồng", top: "75%", left: "62%", fact: "Lâm Đồng có Đà Lạt – thành phố ngàn hoa, mát mẻ quanh năm." },
    { name: "Ninh Thuận", top: "76%", left: "70%", fact: "Ninh Thuận có đồi cát Mũi Dinh – cảnh sa mạc mini bên biển." },
    { name: "Bình Thuận", top: "80%", left: "65%", fact: "Bình Thuận có Mũi Né – đồi cát bay và biển xanh rất nổi tiếng." },
    { name: "Bình Phước", top: "78%", left: "52%", fact: "Bình Phước có rừng cao su xanh mướt và vườn cacao thơm ngon." },
    { name: "Tây Ninh", top: "80%", left: "45%", fact: "Tây Ninh có núi Bà Đen cao 986 mét – ngọn núi thiêng linh." },
    { name: "Đồng Nai", top: "82%", left: "55%", fact: "Đồng Nai có thác Giang Điền – khu du lịch sinh thái gần thành phố." },
    { name: "Bình Dương", top: "81%", left: "50%", fact: "Bình Dương có khu du lịch Đại Nam – công trình kiến trúc ấn tượng." },
    { name: "TP. Hồ Chí Minh", top: "83%", left: "48%", fact: "TP. Hồ Chí Minh là thành phố lớn nhất Việt Nam, sôi động và hiện đại." },
    { name: "Bà Rịa - Vũng Tàu", top: "85%", left: "56%", fact: "Vũng Tàu có bãi biển đẹp và tượng Chúa Kitô Vua trên núi Nhỏ." },
    { name: "Long An", top: "84%", left: "42%", fact: "Long An có rừng ngập mặn Cần Giờ – lá phổi xanh của thành phố Hồ Chí Minh." },
    { name: "Tiền Giang", top: "86%", left: "45%", fact: "Tiền Giang có cù lao Tân Long – vùng trái cây ngọt nổi tiếng miền Tây." },
    { name: "Bến Tre", top: "87%", left: "48%", fact: "Bến Tre được gọi là xứ dừa – cây dừa mọc khắp nơi." },
    { name: "Đồng Tháp", top: "86%", left: "38%", fact: "Đồng Tháp có cánh đồng sen hồng rộng lớn, đẹp như tranh vẽ." },
    { name: "Vĩnh Long", top: "88%", left: "42%", fact: "Vĩnh Long có chợ nổi Cái Bè – mua bán trên sông rất vui nhộn." },
    { name: "Trà Vinh", top: "90%", left: "46%", fact: "Trà Vinh có nhiều chùa Khmer với kiến trúc mái cong rất đẹp." },
    { name: "Cần Thơ", top: "89%", left: "38%", fact: "Cần Thơ có chợ nổi Cái Răng – chợ sáng sớm trên sông Hậu." },
    { name: "Hậu Giang", top: "91%", left: "39%", fact: "Hậu Giang có rừng tràm Trà Sư – chim trời tấp nập bay lượn." },
    { name: "Sóc Trăng", top: "92%", left: "43%", fact: "Sóc Trăng có chùa Dơi – hàng nghìn con dơi treo mình trên cây." },
    { name: "An Giang", top: "88%", left: "32%", fact: "An Giang có núi Sam và miếu Bà Chúa Xứ Núi Sam linh thiêng." },
    { name: "Kiên Giang", top: "92%", left: "28%", fact: "Kiên Giang có quần đảo Phú Quốc – đảo ngọc với biển trong veo." },
    { name: "Bạc Liêu", top: "95%", left: "38%", fact: "Bạc Liêu có nhà Công tử Bạc Liệu và cánh đồng muối trắng xóa." },
    { name: "Cà Mau", top: "98%", left: "32%", fact: "Cà Mau là mũi đất cực Nam Việt Nam – điểm cuối hành trình xuyên Việt!" }
];

// ==========================================
// STATE
// ==========================================
const state = {
    board: null,
    game: new Chess(),
    puzzles: [],
    currentPuzzleIndex: 0,
    startTime: 0,
    timerInterval: null,
    totalPenalty: 0,
    finalElapsedSeconds: 0,
    awaitingNext: false,
    gameFinished: false,
    soundMuted: false,
    audioCtx: null,
    runId: null,
    recordSaved: false,
    /** 'practice' | 'challenge' | null */
    mode: null,
    /** Đã dùng gợi ý / bỏ qua → không được lưu BXH */
    usedAssist: false,
    hintLevel: 0,
    hintMove: null
};

// ==========================================
// UTIL
// ==========================================
function pieceTheme(piece) {
    return 'assets/' + piece.toLowerCase() + '.png';
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function isPractice() {
    return state.mode === "practice";
}

function canSaveRecord() {
    return state.mode === "challenge" && !state.usedAssist && !!state.runId;
}

// ==========================================
// TIMER
// ==========================================
function startTimer() {
    clearInterval(state.timerInterval);
    state.startTime = Date.now();
    state.totalPenalty = 0;

    if (isPractice()) {
        document.getElementById("timer-display").innerText = "Chế độ luyện tập (không tính giờ)";
        return;
    }

    state.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000) + state.totalPenalty;
        document.getElementById("timer-display").innerText = `Thời gian thi đấu: ${formatTime(elapsed)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(state.timerInterval);
    if (isPractice()) {
        state.finalElapsedSeconds = 0;
        return;
    }
    state.finalElapsedSeconds =
        Math.floor((Date.now() - state.startTime) / 1000) + state.totalPenalty;
}

// ==========================================
// SOUND
// ==========================================
function ensureAudio() {
    if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        state.audioCtx = new AudioContext();
    }
    if (state.audioCtx.state === "suspended") {
        state.audioCtx.resume();
    }
    return state.audioCtx;
}

function playSuccessSound() {
    if (state.soundMuted) return;

    const ctx = ensureAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const start = now + i * 0.09;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.start(start);
        osc.stop(start + 0.36);
    });
}

function bounceCar() {
    const car = document.getElementById("cute-car");
    car.classList.remove("car-bounce");
    void car.offsetWidth;
    car.classList.add("car-bounce");
    car.addEventListener("animationend", () => car.classList.remove("car-bounce"), { once: true });
}

function setupSoundToggle() {
    const btn = document.getElementById("sound-toggle");
    const saved = localStorage.getItem("mate1-sound-muted");
    if (saved === "1") {
        state.soundMuted = true;
        btn.textContent = "🔇 Âm thanh: Tắt";
        btn.classList.add("is-muted");
        btn.setAttribute("aria-pressed", "true");
    }

    btn.onclick = () => {
        ensureAudio();
        state.soundMuted = !state.soundMuted;
        localStorage.setItem("mate1-sound-muted", state.soundMuted ? "1" : "0");
        btn.textContent = state.soundMuted ? "🔇 Âm thanh: Tắt" : "🔊 Âm thanh: Bật";
        btn.classList.toggle("is-muted", state.soundMuted);
        btn.setAttribute("aria-pressed", state.soundMuted ? "true" : "false");
        if (!state.soundMuted) playSuccessSound();
    };
}

// ==========================================
// ANTI-CHEAT: GAME RUN (server timestamp)
// ==========================================
async function startGameRun() {
    const ref = await db.collection("runs").add({
        startedAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "playing",
        puzzleCount: routes.length
    });
    state.runId = ref.id;
    state.recordSaved = false;
}

async function finishGameRun(name, time) {
    if (!state.runId) {
        throw new Error("missing-run");
    }

    await db.collection("runs").doc(state.runId).update({
        status: "finished",
        name,
        time,
        finishedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// ==========================================
// LEADERBOARD — giữ BXH cũ + điểm runs mới
// ==========================================
function renderLeaderboard(entries) {
    const targets = ["leaderboard-list", "leaderboard-list-home"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    targets.forEach((list) => {
        list.innerHTML = "";

        if (!entries.length) {
            const li = document.createElement("li");
            li.textContent = "Chưa có kỷ lục nào!";
            list.appendChild(li);
            return;
        }

        entries.slice(0, 10).forEach((d, i) => {
            const li = document.createElement("li");

            const nameDiv = document.createElement("div");
            nameDiv.textContent = `#${i + 1} ${d.name || "Ẩn danh"}`;

            const timeSpan = document.createElement("span");
            timeSpan.textContent = formatTime(Number(d.time) || 0);

            li.appendChild(nameDiv);
            li.appendChild(timeSpan);
            list.appendChild(li);
        });
    });
}

function setLeaderboardMessage(text) {
    ["leaderboard-list", "leaderboard-list-home"].forEach((id) => {
        const list = document.getElementById(id);
        if (!list) return;
        list.innerHTML = "";
        const li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
    });
}

function loadLeaderboard() {
    setLeaderboardMessage("Đang tải...");

    const legacyPromise = db.collection("leaderboard")
        .orderBy("time", "asc")
        .limit(20)
        .get()
        .catch((err) => {
            console.warn("Không đọc được leaderboard cũ:", err);
            return null;
        });

    const runsPromise = db.collection("runs")
        .where("status", "==", "finished")
        .orderBy("time", "asc")
        .limit(20)
        .get()
        .catch((err) => {
            console.warn("Không đọc được runs:", err);
            return null;
        });

    Promise.all([legacyPromise, runsPromise]).then(([legacySnap, runsSnap]) => {
        const entries = [];

        if (legacySnap && !legacySnap.empty) {
            legacySnap.forEach((doc) => {
                const d = doc.data();
                entries.push({
                    name: d.name,
                    time: Number(d.time) || 0,
                    source: "legacy"
                });
            });
        }

        if (runsSnap && !runsSnap.empty) {
            runsSnap.forEach((doc) => {
                const d = doc.data();
                entries.push({
                    name: d.name,
                    time: Number(d.time) || 0,
                    source: "run"
                });
            });
        }

        entries.sort((a, b) => a.time - b.time);
        renderLeaderboard(entries);
    }).catch((err) => {
        console.error(err);
        setLeaderboardMessage("Không tải được bảng xếp hạng.");
    });
}

function setupSaveRecord() {
    document.getElementById("save-btn").onclick = async () => {
        const name = document.getElementById("player-name").value.trim().slice(0, 20);
        if (!name) return alert("Nhập tên để lưu kỷ lục!");

        if (!canSaveRecord()) {
            return alert("Lượt này không đủ điều kiện lưu kỷ lục (luyện tập hoặc đã dùng gợi ý/bỏ qua).");
        }

        if (state.recordSaved) {
            return alert("Kỷ lục của lượt này đã được lưu!");
        }

        const wallSeconds = Math.floor((Date.now() - state.startTime) / 1000);
        const time = wallSeconds + state.totalPenalty;
        state.finalElapsedSeconds = time;

        if (!Number.isFinite(time) || time < 0) {
            return alert("Thời gian không hợp lệ!");
        }

        if (wallSeconds < MIN_SAVE_SECONDS) {
            return alert(
                `Cần chơi ít nhất ${formatTime(MIN_SAVE_SECONDS)} thời gian thật mới lưu được kỷ lục. Còn thiếu khoảng ${formatTime(MIN_SAVE_SECONDS - wallSeconds)}.`
            );
        }

        if (time < MIN_SAVE_SECONDS) {
            return alert(`Thời gian tối thiểu để lưu kỷ lục là ${formatTime(MIN_SAVE_SECONDS)}.`);
        }

        if (time > MAX_SAVE_SECONDS) {
            return alert("Thời gian quá dài để lưu kỷ lục.");
        }

        const saveBtn = document.getElementById("save-btn");
        saveBtn.disabled = true;

        try {
            await finishGameRun(name, Math.floor(time));
            state.recordSaved = true;
            alert("Đã lưu kỷ lục!");
            document.getElementById("save-record-form").style.display = "none";
            loadLeaderboard();
        } catch (err) {
            console.error(err);
            const code = err && err.code;
            if (code === "permission-denied") {
                alert(
                    "Không lưu được: thời gian không khớp phiên chơi (có thể do gian lận hoặc mạng chậm). Hãy chơi lại một lượt."
                );
            } else {
                alert("Không lưu được kỷ lục. Thử lại sau!");
            }
        } finally {
            saveBtn.disabled = false;
        }
    };
}

// ==========================================
// MAP
// ==========================================
function updateCarPosition(i) {
    const loc = routes[Math.min(i, routes.length - 1)];
    const car = document.getElementById("cute-car");

    car.style.top = loc.top;
    car.style.left = loc.left;

    document.getElementById("province-name").innerText = loc.name;
    document.getElementById("province-fact").textContent = `📍 ${loc.fact}`;
}

// ==========================================
// HIGHLIGHT NƯỚC ĐI HỢP LỆ + GỢI Ý
// ==========================================
function removeHighlights() {
    $("#board .square-55d63").removeClass(
        "highlight-legal highlight-capture highlight-hint-from highlight-hint-to"
    );
}

function highlightSquare(square, className) {
    $("#board .square-" + square).addClass(className);
}

function onMouseoverSquare(square) {
    if (state.awaitingNext || state.gameFinished) return;

    const moves = state.game.moves({ square, verbose: true });
    if (!moves.length) return;

    highlightSquare(square, "highlight-legal");
    moves.forEach((m) => {
        const targetPiece = state.game.get(m.to);
        highlightSquare(m.to, targetPiece ? "highlight-capture" : "highlight-legal");
    });
}

function onMouseoutSquare() {
    if (state.hintLevel > 0 && state.hintMove) {
        removeHighlights();
        applyHintHighlights();
        return;
    }
    removeHighlights();
}

function findMateMove() {
    const moves = state.game.moves({ verbose: true });
    for (const m of moves) {
        state.game.move(m);
        const isMate = state.game.in_checkmate();
        state.game.undo();
        if (isMate) {
            return { from: m.from, to: m.to, promotion: m.promotion || "q" };
        }
    }
    return null;
}

function applyHintHighlights() {
    if (!state.hintMove) return;
    if (state.hintLevel >= 1) {
        highlightSquare(state.hintMove.from, "highlight-hint-from");
    }
    if (state.hintLevel >= 2) {
        highlightSquare(state.hintMove.to, "highlight-hint-to");
    }
}

function markAssistUsed() {
    if (state.usedAssist) return;
    state.usedAssist = true;
    if (state.mode === "challenge") {
        const timer = document.getElementById("timer-display");
        const note = " · Đã dùng trợ giúp (không xếp hạng)";
        if (!timer.innerText.includes("không xếp hạng")) {
            timer.innerText += note;
        }
    }
}

function setupHelpButtons() {
    document.getElementById("hint-btn").onclick = () => {
        if (state.awaitingNext || state.gameFinished) return;

        if (!state.hintMove) {
            state.hintMove = findMateMove();
        }
        if (!state.hintMove) {
            alert("Không tìm được nước chiếu hết cho thế cờ này.");
            return;
        }

        markAssistUsed();
        state.hintLevel = Math.min(2, state.hintLevel + 1);
        removeHighlights();
        applyHintHighlights();

        const msg = document.getElementById("status-message");
        if (state.hintLevel === 1) {
            msg.textContent = "Gợi ý: hãy nhìn ô được tô vàng — đó là quân cần đi.";
        } else {
            msg.textContent = "Gợi ý: ô vàng là quân đi, ô xanh lá là ô đích.";
        }
        msg.style.color = "#f9a825";
    };

    document.getElementById("skip-btn").onclick = () => {
        if (state.awaitingNext || state.gameFinished) return;
        if (!confirm("Bỏ qua bài này và đi tiếp?")) return;

        markAssistUsed();
        removeHighlights();
        state.hintLevel = 0;
        state.hintMove = null;
        state.currentPuzzleIndex++;
        updateCarPosition(state.currentPuzzleIndex);
        loadPuzzle(state.currentPuzzleIndex);
    };
}

function updateHelpButtonsVisibility() {
    const help = document.getElementById("help-buttons");
    const show = !state.awaitingNext && !state.gameFinished;
    help.style.display = show ? "flex" : "none";
}

// ==========================================
// CHESSBOARD
// ==========================================
function onDragStart(source, piece) {
    if (state.awaitingNext || state.gameFinished) return false;
    if (state.game.game_over()) return false;

    const turn = state.game.turn();
    if ((turn === "w" && piece.search(/^b/) !== -1) ||
        (turn === "b" && piece.search(/^w/) !== -1)) {
        return false;
    }
    return true;
}

function initBoard() {
    state.board = Chessboard("board", {
        draggable: true,
        pieceTheme,
        position: "start",
        onDragStart,
        onDrop,
        onMouseoverSquare,
        onMouseoutSquare,
        onSnapEnd: () => state.board.position(state.game.fen())
    });

    window.addEventListener("resize", () => state.board.resize());
}

function loadPuzzle(i) {
    const msg = document.getElementById("status-message");
    const nextBtn = document.getElementById("next-btn");
    const saveForm = document.getElementById("save-record-form");

    removeHighlights();
    state.hintLevel = 0;
    state.hintMove = null;

    if (i >= state.puzzles.length) {
        stopTimer();
        state.gameFinished = true;
        state.awaitingNext = false;
        updateHelpButtonsVisibility();

        if (isPractice()) {
            document.getElementById("timer-display").innerText = "Hoàn thành luyện tập!";
            msg.textContent = "🎉 ĐÃ XUYÊN VIỆT THÀNH CÔNG! (Luyện tập — không xếp hạng)";
            msg.style.color = "#2e7d32";
            nextBtn.style.display = "none";
            saveForm.style.display = "none";
            return;
        }

        document.getElementById("timer-display").innerText =
            `Thành tích thi đấu: ${formatTime(state.finalElapsedSeconds)}`;

        if (canSaveRecord()) {
            msg.textContent = "🎉 ĐÃ XUYÊN VIỆT THÀNH CÔNG! 🎉";
            saveForm.style.display = "block";
        } else {
            msg.textContent = "🎉 Hoàn thành! (Đã dùng gợi ý/bỏ qua — không lưu xếp hạng)";
            saveForm.style.display = "none";
        }
        msg.style.color = "#2e7d32";
        nextBtn.style.display = "none";
        return;
    }

    const puzzle = state.puzzles[i];
    state.game.load(puzzle.fen);
    state.awaitingNext = false;
    state.gameFinished = false;

    const turn = state.game.turn();
    state.board.orientation(turn === "w" ? "white" : "black");
    state.board.position(puzzle.fen);

    msg.textContent = `LƯỢT ĐI: BÊN ${turn === "w" ? "TRẮNG" : "ĐEN"} (Bài ${i + 1}/${routes.length})`;
    msg.style.color = turn === "w" ? "#1565c0" : "#37474f";

    nextBtn.style.display = "none";
    saveForm.style.display = "none";
    updateHelpButtonsVisibility();
}

function onDrop(src, dst) {
    if (state.awaitingNext || state.gameFinished) return "snapback";

    ensureAudio();
    removeHighlights();

    const move = state.game.move({ from: src, to: dst, promotion: "q" });
    if (!move) return "snapback";

    const correct = state.game.in_checkmate();
    const msg = document.getElementById("status-message");

    if (correct) {
        state.awaitingNext = true;
        state.hintLevel = 0;
        state.hintMove = null;
        playSuccessSound();
        bounceCar();
        msg.textContent = "Chính xác! Lên xe đi tiếp!";
        msg.style.color = "#2e7d32";
        document.getElementById("next-btn").style.display = "inline-block";
        updateHelpButtonsVisibility();
        return;
    }

    state.game.undo();

    if (!isPractice()) {
        state.totalPenalty += 10;
        msg.textContent = "Sai rồi! +10 giây!";
    } else {
        msg.textContent = "Sai rồi! Thử lại nhé.";
    }
    msg.style.color = "#c62828";

    if (!isPractice()) {
        const timer = document.getElementById("timer-display");
        timer.style.color = "red";
        setTimeout(() => { timer.style.color = "#d84315"; }, 500);
    }

    return "snapback";
}

// ==========================================
// MODE SELECT + INIT
// ==========================================
async function startGameWithMode(mode) {
    state.mode = mode;
    state.usedAssist = false;
    state.hintLevel = 0;
    state.hintMove = null;
    state.runId = null;
    state.recordSaved = false;

    document.getElementById("mode-select").hidden = true;
    document.getElementById("game-container").hidden = false;

    const msg = document.getElementById("status-message");
    msg.textContent = "Đang tải thế trận...";

    try {
        const res = await fetch("puzzles.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const all = await res.json();
        state.puzzles = shuffle(all).slice(0, routes.length);

        if (mode === "challenge") {
            await startGameRun();
        }

        if (!state.board) {
            initBoard();
        }

        state.currentPuzzleIndex = 0;
        updateCarPosition(0);
        loadPuzzle(0);
        startTimer();
        state.board.resize();
    } catch (e) {
        console.error(e);
        if (String(e && e.message).includes("permission") || (e && e.code === "permission-denied")) {
            msg.innerText = "Không tạo được phiên chơi. Kiểm tra Firestore rules đã deploy chưa.";
        } else {
            msg.innerText = "Không thể tải puzzles.json!";
        }
    }
}

function setupModeSelect() {
    document.getElementById("mode-practice").onclick = () => startGameWithMode("practice");
    document.getElementById("mode-challenge").onclick = () => startGameWithMode("challenge");
}

function initApp() {
    loadLeaderboard();
    setupSaveRecord();
    setupSoundToggle();
    setupHelpButtons();
    setupModeSelect();

    document.getElementById("next-btn").onclick = () => {
        state.currentPuzzleIndex++;
        updateCarPosition(state.currentPuzzleIndex);
        loadPuzzle(state.currentPuzzleIndex);
    };
}

document.addEventListener("DOMContentLoaded", initApp);
