
function Game(board){
  this.players = []
  this.currentPlayer;
  this.over = false;
}

Game.prototype.addBoard = function(board){
  this.board = board;
}

Game.prototype.addPlayer = function(player){
  if (this.players.length === 0){
    this.currentPlayer = player;
  }
  this.players.push(player);
}

Game.prototype.switchPlayer = function(){
  this.currentPlayer = this.players[(this.currentPlayer.id + 1) % 2];
}

Game.prototype.over = function(){
  return false;
}

function Player(id, name, mark){
  this.id = id,
  this.mark = mark,
  this.spaces = []
}

Player.prototype.markSpace = function(space){
  this.spaces.push(space);
  space.mark = this.mark;
  space.player = this;
}

Player.prototype.getMark = function(){
  return this.mark;
}

function Board(){
  this.spaces = [],
  this.currentId = 0,
  this.countOccupied = 0
}

Board.prototype.addSpace = function(space){
  space.id = this.currentId;
  this.currentId += 1;
  this.spaces.push(space);
}

Board.prototype.findSpace = function(id){
  for (var i = 0; i < this.spaces.length; i++) {
    if (this.spaces[i]){
      if (this.spaces[i].id == id){
        return this.spaces[i];
      }
    }
  };
  return false;
}

Board.prototype.checkWin = function(player){
  //var mask = ["111000000", "000111000", "000000111", "100100100", "010010010", "001001001", "100010001", "001010100"];
  var mask = [448, 56, 7, 292, 146, 73, 273, 84];
  var currentCombination = "";
  this.spaces.forEach(function(space){
    if (space.mark == game.currentPlayer.mark){
      currentCombination += "1"
    } else {
      currentCombination += "0"
    }
  });
  var combinationNumber = bin2dec(parseInt(currentCombination));
  for (var i = 0; i < mask.length; i++) {
    var maskApplied = combinationNumber & mask[i];
    if (maskApplied === mask[i]){
      console.log("matches!");
      return true;
    }
  };
  return false;
}

Board.prototype.checkTie = function(){
  if (this.occupied === 9){
    return true;
  }
  return false;
}

function bin2dec(bin){
  return parseInt(bin, 2).toString(10);
}

function Space(x, y){
  this.x = x,
  this.y = y,
  this.mark = "";
}

Space.prototype.mark = function(player){
  this.player = player;

}

Space.prototype.markedBy = function(){
  return this.player;
}

Space.prototype.coordinateX = function(){
  return this.x;
}

Space.prototype.coordinateY = function(){
  return this.y;
}

var game = new Game();

$(document).ready(function() {

  $("#form").submit(function(event){
    event.preventDefault();

    var player1 = new Player(0, $("#name1").val(), "X");
    var player2 = new Player(1, $("#name2").val(), "O");

    var board = new Board();

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var space = new Space(i, j);
        board.addSpace(space);
      }
    }

    game.addBoard(board);
    game.addPlayer(player1);
    game.addPlayer(player2);

    console.log(game);

    $(".gameBoard").show();
  });

  for (var cell = 0; cell < 9; cell++) {
    $("#" + cell.toString()).click(function(){
      game.currentPlayer.markSpace(game.board.findSpace(this.id));
      game.board.occupied += 1;
      console.log(game.currentPlayer.mark);
      console.log(this.id);
      console.log(game.board);
      $("#space" + this.id).text(game.currentPlayer.mark);
      if(game.board.checkWin(game.currentPlayer) === true){

        // game.over();
        alert("Game over! Player " + (game.currentPlayer.id + 1).toString() + " win !")
      } else if (game.board.checkTie() === true) {
        alert("Game over with tie!");
      } else {
        game.switchPlayer();
      }

    });
  };

  $("#reset").click(function(){
    location.reload();
  });

});
