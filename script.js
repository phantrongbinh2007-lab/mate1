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

// ==========================================
// ROUTES (Đã phục hồi đủ 63 tỉnh thành)
// ==========================================
const routes = [
    { name: "Hà Giang", top: "5%", left: "45%" },
    { name: "Cao Bằng", top: "7%", left: "55%" },
    { name: "Lào Cai", top: "8%", left: "35%" },
    { name: "Lai Châu", top: "9%", left: "25%" },
    { name: "Điện Biên", top: "12%", left: "20%" },
    { name: "Sơn La", top: "15%", left: "30%" },
    { name: "Yên Bái", top: "14%", left: "40%" },
    { name: "Tuyên Quang", top: "12%", left: "48%" },
    { name: "Bắc Kạn", top: "10%", left: "53%" },
    { name: "Lạng Sơn", top: "12%", left: "60%" },
    { name: "Thái Nguyên", top: "15%", left: "52%" },
    { name: "Phú Thọ", top: "17%", left: "45%" },
    { name: "Vĩnh Phúc", top: "18%", left: "48%" },
    { name: "Hà Nội", top: "20%", left: "50%" },
    { name: "Bắc Giang", top: "18%", left: "56%" },
    { name: "Bắc Ninh", top: "19%", left: "54%" },
    { name: "Quảng Ninh", top: "18%", left: "65%" },
    { name: "Hải Phòng", top: "22%", left: "62%" },
    { name: "Hải Dương", top: "21%", left: "57%" },
    { name: "Hưng Yên", top: "22%", left: "54%" },
    { name: "Hà Nam", top: "24%", left: "52%" },
    { name: "Thái Bình", top: "25%", left: "58%" },
    { name: "Nam Định", top: "26%", left: "55%" },
    { name: "Ninh Bình", top: "27%", left: "50%" },
    { name: "Thanh Hóa", top: "30%", left: "45%" },
    { name: "Nghệ An", top: "35%", left: "40%" },
    { name: "Hà Tĩnh", top: "40%", left: "45%" },
    { name: "Quảng Bình", top: "45%", left: "50%" },
    { name: "Quảng Trị", top: "48%", left: "55%" },
    { name: "Thừa Thiên Huế", top: "51%", left: "60%" },
    { name: "Đà Nẵng", top: "54%", left: "65%" },
    { name: "Quảng Nam", top: "57%", left: "62%" },
    { name: "Quảng Ngãi", top: "60%", left: "65%" },
    { name: "Kon Tum", top: "58%", left: "55%" },
    { name: "Gia Lai", top: "63%", left: "55%" },
    { name: "Bình Định", top: "65%", left: "68%" },
    { name: "Phú Yên", top: "68%", left: "70%" },
    { name: "Đắk Lắk", top: "68%", left: "58%" },
    { name: "Đắk Nông", top: "72%", left: "55%" },
    { name: "Khánh Hòa", top: "72%", left: "72%" },
    { name: "Lâm Đồng", top: "75%", left: "62%" },
    { name: "Ninh Thuận", top: "76%", left: "70%" },
    { name: "Bình Thuận", top: "80%", left: "65%" },
    { name: "Bình Phước", top: "78%", left: "52%" },
    { name: "Tây Ninh", top: "80%", left: "45%" },
    { name: "Đồng Nai", top: "82%", left: "55%" },
    { name: "Bình Dương", top: "81%", left: "50%" },
    { name: "TP. Hồ Chí Minh", top: "83%", left: "48%" },
    { name: "Bà Rịa - Vũng Tàu", top: "85%", left: "56%" },
    { name: "Long An", top: "84%", left: "42%" },
    { name: "Tiền Giang", top: "86%", left: "45%" },
    { name: "Bến Tre", top: "87%", left: "48%" },
    { name: "Đồng Tháp", top: "86%", left: "38%" },
    { name: "Vĩnh Long", top: "88%", left: "42%" },
    { name: "Trà Vinh", top: "90%", left: "46%" },
    { name: "Cần Thơ", top: "89%", left: "38%" },
    { name: "Hậu Giang", top: "91%", left: "39%" },
    { name: "Sóc Trăng", top: "92%", left: "43%" },
    { name: "An Giang", top: "88%", left: "32%" },
    { name: "Kiên Giang", top: "92%", left: "28%" },
    { name: "Bạc Liêu", top: "95%", left: "38%" },
    { name: "Cà Mau", top: "98%", left: "32%" }
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
    gameFinished: false
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
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==========================================
// TIMER
// ==========================================
function startTimer() {
    clearInterval(state.timerInterval);
    state.startTime = Date.now();
    state.totalPenalty = 0;

    state.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000) + state.totalPenalty;
        document.getElementById("timer-display").innerText = `Thời gian: ${formatTime(elapsed)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(state.timerInterval);
    state.finalElapsedSeconds =
        Math.floor((Date.now() - state.startTime) / 1000) + state.totalPenalty;
}

// ==========================================
// LEADERBOARD
// ==========================================
function setLeaderboardMessage(text) {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
}

function loadLeaderboard() {
    setLeaderboardMessage("Đang tải...");

    db.collection("leaderboard")
        .orderBy("time", "asc")
        .limit(10)
        .get()
        .then((snap) => {
            const list = document.getElementById("leaderboard-list");
            list.innerHTML = "";

            if (snap.empty) {
                setLeaderboardMessage("Chưa có kỷ lục nào!");
                return;
            }

            let rank = 1;
            snap.forEach((doc) => {
                const d = doc.data();
                const li = document.createElement("li");

                const nameDiv = document.createElement("div");
                nameDiv.textContent = `#${rank} ${d.name || "Ẩn danh"}`;

                const timeSpan = document.createElement("span");
                timeSpan.textContent = formatTime(Number(d.time) || 0);

                li.appendChild(nameDiv);
                li.appendChild(timeSpan);
                list.appendChild(li);
                rank++;
            });
        })
        .catch((err) => {
            console.error(err);
            setLeaderboardMessage("Không tải được bảng xếp hạng.");
        });
}

function setupSaveRecord() {
    document.getElementById("save-btn").onclick = () => {
        const name = document.getElementById("player-name").value.trim().slice(0, 20);
        if (!name) return alert("Nhập tên để lưu kỷ lục!");

        const time = state.finalElapsedSeconds;
        if (!Number.isFinite(time) || time < 0) {
            return alert("Thời gian không hợp lệ!");
        }

        const saveBtn = document.getElementById("save-btn");
        saveBtn.disabled = true;

        db.collection("leaderboard").add({
            name,
            time,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Đã lưu kỷ lục!");
            document.getElementById("save-record-form").style.display = "none";
            loadLeaderboard();
        }).catch((err) => {
            console.error(err);
            alert("Không lưu được kỷ lục. Thử lại sau!");
        }).finally(() => {
            saveBtn.disabled = false;
        });
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
}

// ==========================================
// CHESSBOARD
// ==========================================
function initBoard() {
    state.board = Chessboard("board", {
        draggable: true,
        pieceTheme,
        position: "start",
        onDrop
    });

    window.addEventListener("resize", () => state.board.resize());
}

function loadPuzzle(i) {
    const msg = document.getElementById("status-message");
    const nextBtn = document.getElementById("next-btn");
    const saveForm = document.getElementById("save-record-form");

    if (i >= state.puzzles.length) {
        stopTimer();
        state.gameFinished = true;
        state.awaitingNext = false;

        document.getElementById("timer-display").innerText =
            `Thành tích: ${formatTime(state.finalElapsedSeconds)}`;

        msg.textContent = "🎉 ĐÃ XUYÊN VIỆT THÀNH CÔNG! 🎉";
        msg.style.color = "#2e7d32";

        nextBtn.style.display = "none";
        saveForm.style.display = "block";
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
}

function onDrop(src, dst) {
    if (state.awaitingNext || state.gameFinished) return "snapback";

    const puzzle = state.puzzles[state.currentPuzzleIndex];

    let move = state.game.move({ from: src, to: dst, promotion: "q" });
    if (!move) return "snapback";

    const moveStr = move.from + move.to + (move.promotion || "");
    const basic = src + dst;

    const solutions = Array.isArray(puzzle.solution)
        ? puzzle.solution
        : [puzzle.solution];

    const correct = solutions.includes(moveStr) || solutions.includes(basic);

    const msg = document.getElementById("status-message");

    if (correct) {
        state.awaitingNext = true;
        msg.textContent = "Chính xác! Lên xe đi tiếp!";
        msg.style.color = "#2e7d32";
        document.getElementById("next-btn").style.display = "inline-block";

        if (move.promotion) {
            setTimeout(() => state.board.position(state.game.fen()), 200);
        }
        return;
    }

    // Sai
    state.game.undo();
    state.totalPenalty += 10;

    msg.textContent = "Sai rồi! +10 giây!";
    msg.style.color = "#c62828";

    const timer = document.getElementById("timer-display");
    timer.style.color = "red";
    setTimeout(() => timer.style.color = "#d84315", 500);

    return "snapback";
}

// ==========================================
// INIT GAME
// ==========================================
async function initGame() {
    loadLeaderboard();
    setupSaveRecord();
    initBoard();

    try {
        const res = await fetch("puzzles.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const all = await res.json();

        state.puzzles = shuffle(all).slice(0, routes.length);

        state.currentPuzzleIndex = 0;
        updateCarPosition(0);
        loadPuzzle(0);
        startTimer();
    } catch (e) {
        console.error(e);
        document.getElementById("status-message").innerText =
            "Không thể tải puzzles.json!";
    }
}

// ==========================================
// NEXT BUTTON
// ==========================================
document.getElementById("next-btn").onclick = () => {
    state.currentPuzzleIndex++;
    updateCarPosition(state.currentPuzzleIndex);
    loadPuzzle(state.currentPuzzleIndex);
};

// ==========================================
// START
// ==========================================
document.addEventListener("DOMContentLoaded", initGame);