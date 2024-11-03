use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;

const THREE_MAZE: [[[u8; 7]; 7]; 12] = [
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
];

#[derive(Serialize, Deserialize)]
pub struct Maze {
    pub board: Vec<Vec<u8>>,
    pub player: (usize, usize),
}

#[tauri::command]
pub fn create_maze(n: usize) -> Maze {
    if n <= 3 {
        let mut rng = rand::thread_rng();
        let r = rng.gen_range(0..24);
        return Maze {
            board: (0..7)
                .map(|i| {
                    (0..7)
                        .map(|j| {
                            if r < 12 {
                                return THREE_MAZE[r % 12][i][j];
                            } else {
                                return THREE_MAZE[r % 12][j][i];
                            }
                        })
                        .collect()
                })
                .collect(),
            player: (1, 1),
        };
    } else {
        let m = 2 * n + 1;
        let direction: [(isize, isize); 4] = [(0, -1), (1, 0), (0, 1), (-1, 0)];

        loop {
            // 0: 壁, 1: 通路, 2: 始点, 3: 終点
            let mut board = vec![vec![1; m]; m];
            for i in 0..m {
                board[i][0] = 0;
                board[i][m - 1] = 0;
                board[0][i] = 0;
                board[m - 1][i] = 0;
            }
            board[1][1] = 2;
            board[m - 2][m - 2] = 3;

            let mut rng = rand::thread_rng();
            let mut queue: VecDeque<(isize, isize)> = if rng.gen_range(0..2) == 0 {
                (2..m as isize - 1)
                    .step_by(2)
                    .flat_map(|i| vec![(0, i), (i, 0), (m as isize - 1, i), (i, m as isize - 1)])
                    .collect()
            } else {
                (2..m as isize - 1)
                    .step_by(2)
                    .rev()
                    .flat_map(|i| vec![(0, i), (i, 0), (m as isize - 1, i), (i, m as isize - 1)])
                    .collect()
            };

            if rng.gen_range(0..2) == 0 {
                board[1][2] = 0;
                board[m - 2][m - 2 - 1] = 0;
            } else {
                board[2][1] = 0;
                board[m - 2 - 1][m - 2] = 0;
            }
            board[2][2] = 0;
            board[m - 2 - 1][m - 2 - 1] = 0;

            while let Some((x, y)) = queue.pop_front() {
                let mut dir = rng.gen_range(0..4);
                let (mut dx, mut dy) = direction[dir];
                for _ in 0..4 {
                    if in_board(m, x + 2 * dx, y + 2 * dy) {
                        if board[(y + 2 * dy) as usize][(x + 2 * dx) as usize] == 1 {
                            board[(y + dy) as usize][(x + dx) as usize] = 0;
                            board[(y + 2 * dy) as usize][(x + 2 * dx) as usize] = 0;
                            if rng.gen_range(0..5) == 0 {
                                queue.push_back((x, y));
                                queue.push_back((x + 2 * dx, y + 2 * dy));
                            } else {
                                queue.push_front((x, y));
                                queue.push_front((x + 2 * dx, y + 2 * dy));
                            }
                            break;
                        } else {
                            dir = (dir + 1) % 4;
                            (dx, dy) = direction[dir];
                        }
                    } else {
                        dir = (dir + 1) % 4;
                        (dx, dy) = direction[dir];
                    }
                }
            }

            let mut step = vec![vec![(m * m) as isize; m]; m];
            let mut stack = vec![(1, 1)];
            step[1][1] = 0;
            while let Some((x, y)) = stack.pop() {
                // 正解の道は一本しかないため，終点に到達したら終了
                if (x, y) == (n as isize - 2, n as isize - 2) {
                    break;
                }
                for i in 0..4 {
                    let (dx, dy) = direction[i];
                    let nx = x + dx;
                    let ny = y + dy;
                    if in_board(m, nx, ny) {
                        if board[ny as usize][nx as usize] != 0
                            && step[ny as usize][nx as usize] > step[y as usize][x as usize] + 1
                        {
                            step[ny as usize][nx as usize] = step[y as usize][x as usize] + 1;
                            stack.push((nx, ny));
                        }
                    }
                }
            }

            // 最短経路を色づける
            // let mut cnt = step[m - 2][m - 2] - 1;
            // let mut x = m - 2;
            // let mut y = m - 2;
            // while (x, y) != (1, 1) {
            //     for i in 0..4 {
            //         let (dx, dy) = direction[&i];
            //         if step[(x as isize + dx) as usize][(y as isize + dy) as usize] == cnt {
            //             x = (x as isize + dx) as usize;
            //             y = (y as isize + dy) as usize;
            //             board[x][y] = 4;
            //             cnt -= 1;
            //             break;
            //         }
            //     }
            // }
            // board[1][1] = 2;

            if step[m - 2][m - 2] >= (m + 2 * (n / 2)) as isize {
                return Maze {
                    board,
                    player: (1, 1),
                };
            }
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MoveResponse {
    pub moved_player: (usize, usize),
    pub is_moved: bool,
}

#[tauri::command]
pub fn move_maze(
    board: Vec<Vec<u8>>,
    player: (usize, usize),
    dx: isize,
    dy: isize,
) -> MoveResponse {
    let (x, y) = (player.0 as isize, player.1 as isize);
    let n = board.len();
    if in_board(n, x + 2 * dx, y + 2 * dy) {
        if board[(y + dy) as usize][(x + dx) as usize] != 0 {
            return MoveResponse {
                moved_player: ((x + 2 * dx) as usize, (y + 2 * dy) as usize),
                is_moved: true,
            };
        }
    }
    return MoveResponse {
        moved_player: player,
        is_moved: false,
    };
}

fn in_board(n: usize, x: isize, y: isize) -> bool {
    return 0 <= x && x < n as isize && 0 <= y && y < n as isize;
}
