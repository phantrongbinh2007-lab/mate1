// ==========================================
// CẤU HÌNH FIREBASE
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

// Khởi tạo Firebase (Cú pháp Compat tương thích với thẻ script trong HTML)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// CẤU HÌNH BẢN ĐỒ VÀ GAME
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

let board = null;
let game = new Chess();
let puzzles = [];
let currentPuzzleIndex = 0;

let startTime = 0;
let timerInterval = null;
let totalPenalty = 0;
let finalElapsedSeconds = 0; 

// ==========================================
// LOGIC HIỂN THỊ BẢNG XẾP HẠNG
// ==========================================
function loadLeaderboard() {
    db.collection("leaderboard")
      .orderBy("time", "asc") 
      .limit(10) 
      .onSnapshot((querySnapshot) => {
          const list = document.getElementById("leaderboard-list");
          list.innerHTML = ""; 
          let rank = 1;
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              const li = document.createElement("li");
              li.innerHTML = `<div>#${rank} ${data.name}</div> <span>${formatTime(data.time)}</span>`;
              list.appendChild(li);
              rank++;
          });
          if (list.innerHTML === "") {
              list.innerHTML = "<li>Chưa có kỷ lục nào!</li>";
          }
      });
}

// Xử lý lưu điểm
document.getElementById('save-btn').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value.trim();
    if (playerName === "") {
        alert("Bro phải nhập tên để lên bảng vàng chứ!");
        return;
    }
    
    // Đẩy dữ liệu lên Firebase
    db.collection("leaderboard").add({
        name: playerName,
        time: finalElapsedSeconds,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Lưu kỷ lục thành công! Kiểm tra bảng vàng nhé.");
        document.getElementById('save-record-form').style.display = "none";
    }).catch((error) => {
        console.error("Lỗi lưu điểm: ", error);
        alert("Có lỗi xảy ra, không thể lưu điểm. Nhớ kiểm tra xem đã bật Test Mode trong Firestore chưa nhé!");
    });
});

// ==========================================
// LOGIC GAME CHÍNH
// ==========================================
function pieceTheme(piece) {
    return 'assets/' + piece.toLowerCase() + '.png';
}

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    totalPenalty = 0;
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000) + totalPenalty;
        document.getElementById('timer-display').innerText = `Thời gian: ${formatTime(elapsed)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    finalElapsedSeconds = Math.floor((Date.now() - startTime) / 1000) + totalPenalty;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function initGame() {
    loadLeaderboard(); 
    
    try {
        const response = await fetch('puzzles.json');
        let allPuzzles = await response.json();
        
        allPuzzles = shuffleArray(allPuzzles);
        puzzles = allPuzzles.slice(0, routes.length);
        
        loadPuzzle(0);
        updateCarPosition(0);
        startTimer(); 
    } catch (error) {
        document.getElementById('status-message').innerText = "Không thể tải file puzzles.json!";
        console.error(error);
    }
}

function loadPuzzle(index) {
    if (index >= puzzles.length || index >= routes.length) {
        stopTimer(); 
        const finalTime = formatTime(finalElapsedSeconds);
        document.getElementById('timer-display').innerText = `Thành tích: ${finalTime}`;
        document.getElementById('status-message').innerHTML = `🎉 ĐÃ XUYÊN VIỆT THÀNH CÔNG! 🎉`;
        document.getElementById('status-message').style.color = "#2e7d32";
        document.getElementById('next-btn').style.display = "none";
        
        // Hiện form để điền tên đua top
        document.getElementById('save-record-form').style.display = "block";
        
        if(board) board.destroy(); 
        return;
    }

    const puzzle = puzzles[index];
    game.load(puzzle.fen);
    
    const turn = game.turn(); 
    const turnText = turn === 'w' ? "TRẮNG" : "ĐEN";
    const turnColor = turn === 'w' ? "#1565c0" : "#37474f";
    const boardOrientation = turn === 'w' ? 'white' : 'black'; 

    const config = {
        draggable: true,
        position: puzzle.fen,
        orientation: boardOrientation, 
        pieceTheme: pieceTheme,
        onDrop: onDrop
    };
    
    board = Chessboard('board', config);
    
    const statusMsg = document.getElementById('status-message');
    statusMsg.innerText = `LƯỢT ĐI: BÊN ${turnText} (Bài ${index + 1}/${routes.length})`;
    statusMsg.style.color = turnColor;
    document.getElementById('next-btn').style.display = "none";
}

function onDrop(source, target) {
    const currentPuzzle = puzzles[currentPuzzleIndex];

    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    const moveStr = move.from + move.to + (move.promotion ? move.promotion : '');
    const basicMoveStr = source + target; 

    const solutions = Array.isArray(currentPuzzle.solution)
        ? currentPuzzle.solution
        : [currentPuzzle.solution];

    if (solutions.includes(moveStr) || solutions.includes(basicMoveStr)) {
        document.getElementById('status-message').innerText = "Chính xác! Lên xe đi tiếp thôi!";
        document.getElementById('status-message').style.color = "#2e7d32";
        document.getElementById('next-btn').style.display = "inline-block";

        if (move.promotion) {
            setTimeout(() => board.position(game.fen()), 250);
        }
        return; 
    } else {
        game.undo(); 
        totalPenalty += 10; 
        
        document.getElementById('status-message').innerText = `Sai rồi! Bị phạt +10 giây. Hãy thử lại!`;
        document.getElementById('status-message').style.color = "#c62828";
        
        const timerObj = document.getElementById('timer-display');
        timerObj.style.color = "red";
        setTimeout(() => { timerObj.style.color = "#d84315"; }, 500);

        return 'snapback'; 
    }
}

function updateCarPosition(routeIndex) {
    const loc = routes[Math.min(routeIndex, routes.length - 1)];
    const car = document.getElementById('cute-car');
    
    car.style.top = loc.top;
    car.style.left = loc.left;
    document.getElementById('province-name').innerText = loc.name;
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentPuzzleIndex++;
    updateCarPosition(currentPuzzleIndex);
    loadPuzzle(currentPuzzleIndex);
});

$(document).ready(initGame);