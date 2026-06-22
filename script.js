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
// ROUTES (giữ nguyên)
// ==========================================
const routes = [ /* ... giữ nguyên toàn bộ danh sách tỉnh ... */ ];

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
    finalElapsedSeconds: 0
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
function loadLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "<li>Đang tải...</li>";

    db.collection("leaderboard")
        .orderBy("time", "asc")
        .limit(10)
        .get()
        .then((snap) => {
            list.innerHTML = "";
            let rank = 1;

            snap.forEach((doc) => {
                const d = doc.data();
                const li = document.createElement("li");
                li.innerHTML = `<div>#${rank} ${d.name}</div><span>${formatTime(d.time)}</span>`;
                list.appendChild(li);
                rank++;
            });

            if (!list.innerHTML.trim()) {
                list.innerHTML = "<li>Chưa có kỷ lục nào!</li>";
            }
        });
}

function setupSaveRecord() {
    document.getElementById("save-btn").onclick = () => {
        const name = document.getElementById("player-name").value.trim();
        if (!name) return alert("Nhập tên để lưu kỷ lục!");

        db.collection("leaderboard").add({
            name,
            time: state.finalElapsedSeconds,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Đã lưu kỷ lục!");
            document.getElementById("save-record-form").style.display = "none";
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
        document.getElementById("timer-display").innerText =
            `Thành tích: ${formatTime(state.finalElapsedSeconds)}`;

        msg.innerHTML = "🎉 ĐÃ XUYÊN VIỆT THÀNH CÔNG! 🎉";
        msg.style.color = "#2e7d32";

        nextBtn.style.display = "none";
        saveForm.style.display = "block";
        return;
    }

    const puzzle = state.puzzles[i];
    state.game.load(puzzle.fen);

    const turn = state.game.turn();
    state.board.orientation(turn === "w" ? "white" : "black");
    state.board.position(puzzle.fen);

    msg.innerText = `LƯỢT ĐI: BÊN ${turn === "w" ? "TRẮNG" : "ĐEN"} (Bài ${i + 1}/${routes.length})`;
    msg.style.color = turn === "w" ? "#1565c0" : "#37474f";

    nextBtn.style.display = "none";
    saveForm.style.display = "none";
}

function onDrop(src, dst) {
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
        msg.innerText = "Chính xác! Lên xe đi tiếp!";
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

    msg.innerText = "Sai rồi! +10 giây!";
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
        let all = await res.json();

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
