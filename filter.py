import csv
import json
import chess

def extract_mate_in_1(input_csv, output_json, limit=50, min_rating=1000, max_rating=3000):
    puzzles = []
    
    # Đọc file CSV của Lichess
    with open(input_csv, mode='r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        
        for row in reader:
            themes = row['Themes']
            rating = int(row['Rating'])
            
            # Điều kiện lọc: Chứa tag "mateIn1" và nằm trong khoảng Rating
            if 'mateIn1' in themes and min_rating <= rating <= max_rating:
                moves = row['Moves'].split()
                
                if len(moves) >= 2:
                    blunder_move = moves[0] # Nước đi sai lầm của đối thủ
                    board = chess.Board(row['FEN'])
                    
                    try:
                        board.push_uci(blunder_move)
                        new_fen = board.fen()
                        
                        correct_mates = []
                        # Duyệt qua tất cả các nước đi hợp lệ
                        for legal_move in board.legal_moves:
                            board.push(legal_move)
                            if board.is_checkmate():
                                correct_mates.append(legal_move.uci())
                            board.pop()
                        
                        # ==========================================
                        # LOGIC MỚI: CHỈ LẤY BÀI CÓ ĐÚNG 1 ĐÁP ÁN
                        # ==========================================
                        if len(correct_mates) == 1:
                            single_solution = correct_mates[0]
                            
                            # Xử lý tương thích với Frontend (Auto-Queen):
                            # Nếu nước đi là phong cấp (độ dài chuỗi = 5, ví dụ 'e7e8n') 
                            # và ký tự cuối KHÔNG phải là 'q', thì bỏ qua luôn thế cờ này.
                            if len(single_solution) == 5 and single_solution[-1].lower() != 'q':
                                continue

                            # Không xuất solution ra client (chống đọc đáp án).
                            # Frontend xác nhận bằng chess.js in_checkmate().
                            puzzles.append({
                                "id": row['PuzzleId'],
                                "fen": new_fen,
                                "rating": rating
                            })
                            
                            # Đủ số lượng bài tập thì dừng vòng lặp
                            if len(puzzles) >= limit:
                                break
                            
                    except ValueError:
                        # Nếu có lỗi FEN hoặc nước cờ không hợp lệ thì bỏ qua
                        continue

    # Xuất ra file JSON
    with open(output_json, mode='w', encoding='utf-8') as outfile:
        json.dump(puzzles, outfile, indent=2)
        
    print(f"✅ Đã xử lý xong! Trích xuất thành công {len(puzzles)} bài tập có 1 đáp án duy nhất vào '{output_json}'.")

# ==========================================
# CẤU HÌNH THÔNG SỐ VÀ CHẠY
# ==========================================
if __name__ == "__main__":
    extract_mate_in_1(
        input_csv='lichess_db_puzzle.csv', 
        output_json='puzzles.json', 
        limit=2000,            
        min_rating=1300,      
        max_rating=1900       
    )