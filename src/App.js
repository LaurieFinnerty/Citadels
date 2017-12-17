import React from 'react';
import ReactDOM from 'react-dom';

import Game from './components/Game';
import Button from './components/Button';

import aStyles from './scripts/aStyles';
import bStyles from './scripts/bStyles';

import chevron_up from './glyphicons/chevron-up.svg';
import chevron_down from './glyphicons/chevron-down.svg';
import user from './glyphicons/user.svg';
import computer from './glyphicons/display.svg';

import calculate_winner from './scripts/calculate_winner';
import calculate_score from './scripts/calculate_score';

import Rules from './views/Rules'
import NewGame from './views/NewGame'

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {    
      history: [{
        squares: Array(15).fill(0),
        teams: Array(15).fill(),
      }],
      stepNumber: 0,
      xIsNext: true,    
      nextTeam: 'A',
      twoPlayer: false,
      boardSize: undefined,    
      difficulty: undefined,
      tileSize: 3.5,
      aStyle:[],
      bStyles:[],
      sideBar: true,    
      panel: "new",
      winner: false,
      score: [],
      message: "Defend your kingdom! Your enemy is plotting against you...",
    };     
  }    
   
  componentWillMount(){
      this.newGame(15,0,2);
  }    
   
  //give each square a random starting value greater than one and less than four    
  randomSquares() {
      return Math.floor(Math.random()*3)+1;
  }   
   
  /*    
  randomTeams() {
      const newTeam = Math.floor(Math.random()*5);
      if (newTeam === 1){
          return aStyles;
      } else {
          return bStyles;
      }
  }    
  */    
  newGame(boardSize,difficulty,tileSize){
    console.log("NEW GAME!");  
      
    const squares = Array(boardSize*boardSize).fill(4).map(this.randomSquares);
    const teams = Array(boardSize*boardSize).fill();
     
    //randomly place the citadels  
    const blueCitadelSite = Math.floor((Math.random()*boardSize)+(boardSize*boardSize*.8));
    const redCitadelSite = Math.floor(Math.random()*boardSize+boardSize);   
      
    //set the team placement on the board
      for(var i=0;i<squares.length;i++){
          if (Math.abs(blueCitadelSite-i) < (boardSize*boardSize)*.35){
              teams[i] = aStyles;
          } else {
              teams[i] = bStyles;
          } 
      }  
     
   //set the center of the citadels and surrounding tiles   
      squares[redCitadelSite] = 6;
      teams[redCitadelSite] = bStyles;
      squares[redCitadelSite+1] = 5;
      teams[redCitadelSite+1] = bStyles;
      squares[redCitadelSite-1] = 5;
      teams[redCitadelSite-1] = bStyles;
      squares[redCitadelSite+this.state.boardSize] = 5;
      teams[redCitadelSite+this.state.boardSize] = bStyles;
      squares[redCitadelSite-this.state.boardSize] = 5;
      teams[redCitadelSite-this.state.boardSize] = bStyles;
      
      squares[blueCitadelSite] = 6;
      teams[blueCitadelSite] = aStyles;
      squares[blueCitadelSite+1] = 5;
      teams[blueCitadelSite+1] = aStyles;
      squares[blueCitadelSite-1] = 5;
      teams[blueCitadelSite-1] = aStyles;
      squares[blueCitadelSite+this.state.boardSize] = 5;
      teams[blueCitadelSite+this.state.boardSize] = aStyles;
      squares[blueCitadelSite-this.state.boardSize] = 5;
      teams[blueCitadelSite-this.state.boardSize] = aStyles;
      
      this.setState({
          boardSize: boardSize,
          difficulty: difficulty,
          tileSize: tileSize,
          squares: squares,
          teams: teams,
      })
  
      this.historyCallBack(squares,teams);      
  }        
        
  historyCallBack(squares,teams){
      const history = this.state.history;
      this.setState({
              history: history.concat([{
                       squares: squares,
                       teams: teams,
              }]),
              stepNumber: this.state.stepNumber + 1,
      });
      console.log("HISTORY");
      console.log(this.state.history);
  }    
        
  xIsNextCallBack(x){
      console.log("x is next callBack!");
      console.log(x);
      if (x){
          this.setState({
              xIsNext: !this.state.xIsNext,
          })
      }
  }    
  
  messageCallBack(message,i){
      this.setState({
          message: message,
      })
  }    
    
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
      
  updatePanel(panel) {
    switch(panel){
        case "rules":
            this.setState({
                panel: "rules",
            });
            return;
            
        case "undo":
            this.setState({
                panel: "undo",
            });
            return;
        
        case "new":
            this.setState({
                panel: "new",
            });
            return;
    }
  }
        
  render() {
    console.log("App render!");
    console.log(this.state);
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const winner = calculate_winner(current.squares,current.teams);  
 
    const score = calculate_score(current.squares,current.teams); 

    const message = this.state.message;  
      
    const bluescore = score[0]; 
    const redscore = score[1];
      
    let blueStyle;
    blueStyle = {
        backgroundImage: `url(${user})`,
        width: '3vw',
        height: '3vw',
        backgroundSize: 'cover',
    }
    
    let redStyle;
    let redIcon;
    if(this.state.twoPlayer){
        redIcon = computer;
    } else {
        redIcon = user;
    }
      
    redStyle = {
        backgroundImage: `url(${redIcon})`,
        width: '3vw',
        height: '3vw',
        backgroundSize: 'cover',
    }
      
    let status;
    let statusClass;
    if (winner && history.length > 2) {
      status = winner + "WINS! Game Over";
      statusClass = "winner-status";
    } else {
      status = (this.state.xIsNext ? 'BLUE' : 'RED') + "'S TURN";
      statusClass = this.state.xIsNext ? "blue-status" : "red-status";    
    }
          
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'RESET';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });    
     
    let panel;
    if (this.state.panel === "undo"){
        panel = moves;
    } else if (this.state.panel === "new") {
        panel = <NewGame 
                    boardSize = {this.state.boardSize}
                    newGameCallBack = {(boardSize,difficulty,tileSize) => this.newGame(boardSize,difficulty,tileSize)}
                />;
    } else if (this.state.panel === "rules") {
        panel = <Rules />;
    }

    let toggleStyle;
    if(this.state.sideBar){
        toggleStyle = {
            backgroundImage: `url(${chevron_down})`,
            width: '3vw',
            height: '3vw',
            backgroundSize: 'cover',
        }
    }

    let sidebar;
    if (this.state.sideBar === true){
        sidebar = <div className="game-info">
                      <button id="sidebar_toggle"
                              style={toggleStyle}      
                      >
                        
                      </button>
                      
                      <div id="title">CITADELS</div>    

                      <div className="score-info">
                          <table>
                          <tbody>
                            <tr>
                               <td style={blueStyle}></td>
                               <td style={{color:'blue'}}>{bluescore}</td>
                               <td>|</td>
                               <td style={{color:'red'}}>{redscore}</td>
                               <td style={redStyle}></td>
                             </tr>
                          </tbody> 
                          </table>       
                      </div>   
                      <div className="message">
                          <div className={statusClass}>{status}</div>
                          {message}
                      </div>      
                          
                      <div id="button-collection">
                        <Button 
                        value="NEW GAME"
                        onClick={() => this.updatePanel("new")}
                        /> 
                        <Button 
                        value="UNDO"
                        onClick={() => this.updatePanel("undo")}
                        />
                        <Button 
                        value="HOW TO PLAY"
                        onClick={() => this.updatePanel("rules")}
                        />
                      </div>      

                      <div id="display">{}
                        {panel}
                      </div>
                    </div>
                  
    } else {
        sidebar = <div className="game-info-top">
                    <div id="title-horizontal">CITADELS</div>
                    <div className="score-info">
                          <span style={{color:'blue'}}>Blue:  {bluescore}</span> 
                          <span style={{color:'red'}}> Red:  {redscore}</span>
                    </div>

                      <div className="message">
                          <div className={statusClass}>{status}</div>
                          {message}
                      </div>
                  </div>    
    }

    return (
      <div className="game">

          <div className="sidebar">
              {sidebar}
          </div>
          <Game
            squares={current.squares}
            teams={current.teams}
            xIsNext={this.state.xIsNext}
            onClick={(i) => this.handleClick(i)}
            boardSize = {this.state.boardSize}
            newGame = {this.state.newGame}
            twoPlayer = {this.state.twoPlayer}
            historyCallBack = {(squares,teams) => this.historyCallBack(squares,teams)}
            xIsNextCallBack = {(bool) => this.xIsNextCallBack(bool)}
            messageCallBack = {(message,xy) => this.messageCallBack(message,xy)}
          />
          
        </div>
        
    );
  }
}

// ========================================

export default App;