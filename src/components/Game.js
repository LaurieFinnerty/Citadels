import React from 'react';

import Board from './Board';

import human_player from '../scripts/human_player';
import computer_player from '../scripts/computer_player';
import play from '../scripts/play';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newGame: this.props.newGame,
      boardSize: this.props.boardSize,    
      squares: this.props.squares,
      teams: this.props.teams,
      stepNumber: this.props.stepNumber,
      xIsNext: this.props.xIsNext,    
      nextTeam: 'A',
      twoPlayer: this.props.twoPlayer,
      //boardUpdated: false,
      tileStyles: this.props.tileStyles,
    };  
    this.handleClick = this.handleClick.bind(this);
    this.updateBoard = this.updateBoard.bind(this);  
  }    
   
        
  handleClick(i) {
    //console.log("click");

    this.setState({boardUpdated:false,})

    const squares = this.state.squares;
    const teams = this.state.teams;
    const boardSize = this.props.boardSize;
         
    const playing = this.props.xIsNext;
    const updateCB = this.updateBoard;  
    const twoPlayer = this.state.twoPlayer;
    const aStyles = this.state.tileStyles[0];
    const bStyles = this.state.tileStyles[1];  
    
    human_player(i, playing,squares,teams, boardSize, aStyles,bStyles, updateCB);
        
  }
    
  updateBoard(squares,teams,message,i){
      console.log("updating board!");
      console.log(message,i)
      /*
      this.setState({
          squares: squares,
          teams: teams,
      });
      */
    //save move to history
    this.saveHistory(squares,teams,message,i);     
  }   
    
  //sends current gamestate info back to historyCallBack in app 
  saveHistory(squares,teams,message,i){
      const callBack = this.props.historyCallBack;
      console.log("saving history");
      console.log(this.props.xIsNext);
      //update next player to app
      callBack(squares,teams,message,i);
        
       const boardSize = this.props.boardSize;  
       //const messageCB = this.props.messageCallBack;
       const updateCB = this.updateBoard;   
       const playing = this.props.xIsNext;
       const difficulty = this.props.difficulty;
       const aStyles = this.props.tileStyles[0];
       const bStyles = this.props.tileStyles[1];
       
      //run computer player after delay if two player is true  
       if (this.props.xIsNext === true && this.props.twoPlayer ===true){
        //console.log("computer player go!")
        setTimeout(function(){
          computer_player(!playing,difficulty,squares,teams,boardSize, aStyles,bStyles, updateCB)}, 1000)
        }
      
      //this is where auto mode will hook in
  }   
    
            
  render() {
     console.log("Game render!");
     console.log(this.props);
     //console.log("Game xIsNext");
     //console.log(this.props.xIsNext);
    return (
          <Board
            squares={this.props.squares}
            teams={this.props.teams}
            selectedI={this.props.selectedI}
            boardSize={this.props.boardSize}
            tileSize={this.props.tileSize}
            tileStyles={this.props.tileStyles}
            onClick={(i) => this.handleClick(i)}
            updateCB={(squares,teams,message,i) => this.updateBoard(squares,teams,message,i)}
            xIsNext = {this.props.xIsNext}
          />
    );
  }
}

// ========================================

export default Game;


