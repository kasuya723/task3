import { useState } from 'react';

// 1つのマスを表示するコンポーネント
// valueにはマスの値（X、O、またはnull）、onSquareClickにはクリック時の処理が渡される
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 9個のマスと、現在のゲーム状況を表示するコンポーネント
function Board({ xIsNext, squares, onPlay }) {
  // クリックされたマスの番号を受け取り、次の盤面を作成
  function handleClick(i) {
    // すでに勝者がいる場合、またはクリックしたマスが埋まっている場合は処理を終了
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // 現在の盤面をコピーし、元の配列を直接変更しないようにする
    const nextSquares = squares.slice();

    // 次のプレイヤーに応じて、クリックしたマスにXまたはOを入れる
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    // 更新した盤面を親コンポーネントに渡す
    onPlay(nextSquares);
  }

  // 現在の盤面から勝者を判定
  const winner = calculateWinner(squares);
  let status;

  // 勝者がいる場合は勝者を、いない場合は次のプレイヤーを表示
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      {/* 各マスに値とクリック時の処理を渡して、3×3の盤面を表示 */}
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// ゲーム全体の状態を管理するコンポーネント
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 新しい手が打たれたとき、盤面の履歴を更新
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 指定した手数の盤面に戻る
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 保存されている盤面履歴から、各手順へ戻るボタンを作成
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* 現在の手番、盤面、盤面更新用の関数をBoardに渡す */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* 過去の手順へ戻るためのボタン一覧表示 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 盤面の値を調べ、同じ記号が3つ並んでいるか判定
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // 8通りの並びを順番に確認
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // 3マスがすべて埋まっていて、同じ記号ならその記号を勝者として返す
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // どの並びにも勝者がいない場合はnullを返す
  return null;
}
