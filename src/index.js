import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './stylesheet.scss';

function Square(props) {
  if(props.winners 
    && (props.squareVal === props.winners[0]
     || props.squareVal === props.winners[1]
     || props.squareVal === props.winners[2])) {
      return (
        <button className="winnerSquare" onClick={props.onClick}>
          {props.value}
        </button>
      );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        squareVal= {i}
        winners= {this.props.winnerSquares}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }], 
      stepNumber: 0,
      xIsNext: true, 
      selectedMove: null,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares: squares, 
      }]),
      stepNumber: history.length, 
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step, 
      xIsNext: (step % 2) === 0,
    });
    this.state.selectedMove = step;
  }

  render() {
    const history = this.state.history; 
    const current = history[this.state.stepNumber]; 
    
    const winner = calculateWinner(current.squares);
    var winnerSquares = winner ? winner.winnerSquares : null;

    const moves = history.map((step, move) => {
      var changedElement = null; 
      if(move){
        if(move === 0){
          changedElement = history[move].squares.forEach((element, index) => {
            if(element)
              return index;
            });
          }else{
            for(var i = 0; i < history[move].squares.length; i++){
              if(history[move].squares[i] != history[move - 1].squares[i]){
                changedElement = i; 
                break;
              }
            }
          }
      }
      
      var changedIndex = getChangedIndex(changedElement + 1);
  
      const desc = move ? 
        'Go to move # ' + move + ' ' + changedIndex : 
        'Go to game start';
        if(this.state.selectedMove === move)
        {
          return (
            <li key={move}>
              <button onClick = {() => this.jumpTo(move)}><b>{desc}</b></button>
            </li>
          )
        }else{
          return (
            <li key={move}>
              <button onClick = {() => this.jumpTo(move)}>{desc}</button>
            </li>
          )
        }
    });
    this.state.selectedMove = null;
    let status; 
    if(winner != null && winner.winner) {
      status = 'Winner: ' + winner.winner; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winnerSquares = {winnerSquares}
            squares={current.squares}
            onClick = {(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({winner: squares[a], 
               winnerSquares: [a, b, c], 
            });
    }
  }
  return null;
}
function getChangedIndex(element){
  if(!element)
    return '';
  var indexes = {}; 
  indexes[1] = '(0, 0)'; 
  indexes[2] = '(0, 1)'; 
  indexes[3] = '(0, 2)'; 
  indexes[4] = '(1, 0)'; 
  indexes[5] = '(1, 1)'; 
  indexes[6] = '(1, 2)'; 
  indexes[7] = '(2, 0)'; 
  indexes[8] = '(2, 1)'; 
  indexes[9] = '(2, 2)';
  
  return indexes[element];
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

