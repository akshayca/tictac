/*
*
* Based on the MiniMax Algorithm found here: http://neverstopbuilding.com/minimax
* Some of the design aspects where from here: https://perfecttictactoe.herokuapp.com/
* Some of the concepts, ways, and code design is from StackOverFlow
*
*
*
* A simple tic-tac-toe game, you can do the following:
*   1. Play against a computer (unbeatable)
*   2. Play against another person (2 players)
*   3. Choose who starts first (by chosing the X\O sign)
*   4. Change the settings (and reset the match)
*/


// Setup
var mainBoard = [0,0,0,0,0,0,0,0,0], symbols = [' ', '<i class="fa fa-times" aria-hidden="true"></i>', '<i class="fa fa-circle-o" aria-hidden="true"></i>'], winIndices = [];

var turn = 1, choice = 0, singlePlayer = true, player = 1;

$(function() {
  /* ------------------------ SETTINGS ------------------------ */
  $(".playersNum span").click(function() {
    $(".playersNum span.active").removeClass("active");
    $(this).addClass("active");
    
    // It is pointless to choose who starts first when both players are human
    if($(this).hasClass("multi-player")) {
      $(".cross").addClass("active");
      $(".circle").removeClass("active");
      $(".circle").addClass("disabled");
    } else $(".circle").removeClass("disabled");
  });
  
  $(".symbols span").click(function() {
    $(".symbols span.active").removeClass("active");
    $(this).addClass("active");
    
    if($(".playersNum span.active").hasClass("multi-player")) {
      $(".cross").addClass("active");
      $(".circle").removeClass("active");
    }
      
  });
  
  $(".submit").click(function() {
    if($(".playersNum span.active").hasClass("single-player"))
      singlePlayer = true;
    else singlePlayer = false;
      
    if($(".symbols span.active").hasClass("cross"))
      player = 1;
    else player = 2;
    
    $(".options").hide();
    $(".options-buttons").show();
    
    resetMatch();
  });
  
  $(".settings").click(function() {
    $(".options").show();
  });
  
  $(".restart").click(function() {
    setTimeout(resetMatch, 100);
  });
  
  $("td").on("click", function() {
    if($(this).html() === "&nbsp;") {
      if(!singlePlayer) {
        // show to the player(s)
        $(this).html(symbols[turn]);
        
        // add to the board
        mainBoard[parseInt($(this)[0].id)] = turn;
        
        if(winWithIndex(mainBoard, turn)) {
            setTimeout(resetMatch, 2000);
            showResult(turn);
         } else if(mainBoard.indexOf(0) === -1) 
            showResult(0);
        
        // alternate the turn
        turn = turn === 1 ? 2 : 1;
        
        // single player and the player starts with X
      } else if(singlePlayer && turn === player) {
          $(this).html(symbols[turn]);
          mainBoard[parseInt($(this)[0].id)] = turn;
          
          if(winWithIndex(mainBoard, turn)) {
            setTimeout(resetMatch, 2000);
            showResult(turn);
          } else if(mainBoard.indexOf(0) === -1) { 
            showResult(0);
            setTimeout(resetMatch, 2000);
          } else {
            setTimeout(pcTurn, 500);
          }

          turn = turn === 1 ? 2 : 1;
      }
    }
  });
  
  // The AI
  function pcTurn() {
    // get the perfect choice
    miniMax(mainBoard, turn, 0);
    mainBoard[choice] = turn;
    $("td")[choice].innerHTML = symbols[turn];
    
    if(winWithIndex(mainBoard, turn)) {
      setTimeout(resetMatch, 2000);
      showResult(turn);
    } else if(mainBoard.indexOf(0) === -1) {
      setTimeout(resetMatch, 2000);
      showResult(0);
    }
    
    turn = player; 
  }
  
});



function miniMax(board, activePlayer, depth) {
    // if the game is over return the score
    if(win(board, player)) {
        return 10 - depth;
    } else if(win(board, player === 1 ? 2 : 1)) {
        return depth - 10;
    } else if(board.indexOf(0) === -1) return 0;
  
    // initialization 
    depth += 1
    var scores = [];
    var moves = [];

    // try out all the avaliable options
    getAvailableMoves(board).forEach(function(move) {
        board[move] = activePlayer;
        scores.push(miniMax(board, activePlayer === 1 ? 2 : 1, depth));
        moves.push(move);
        board[move] = 0;
    });

    // get the maximum score for the player
    if(activePlayer === player) {
        var maxScoreIndex = scores.indexOf(Math.max(...scores));
        choice = moves[maxScoreIndex];
        return scores[maxScoreIndex];
    } else { // get the minimum score for the AI
        var minScoreIndex = scores.indexOf(Math.min(...scores));
        choice = moves[minScoreIndex];
        return scores[minScoreIndex];
    }

}

function getAvailableMoves(board) {
  var emptyIndex = [];
  for(var i = 0; i < board.length; i++) {
    if(board[i] === 0) {
      emptyIndex.push(i);
    }
  }
  
  return emptyIndex;
}

function win(board, player) {
  // Horizontal check
  if(board[0] === player && board[1] === player && board[2] === player) return true;
  if(board[3] === player && board[4] === player && board[5] === player) return true;
  if(board[6] === player && board[7] === player && board[8] === player) return true;
  
  // Vertical check
  if(board[0] === player && board[3] === player && board[6] === player) return true;
  if(board[1] === player && board[4] === player && board[7] === player) return true;
  if(board[2] === player && board[5] === player && board[8] === player) return true;
  
  // Diagonal check
  if(board[0] === player && board[4] === player && board[8] === player) return true;
  if(board[2] === player && board[4] === player && board[6] === player) return true;

  return false
}

function winWithIndex(board, player) {
  // Horizontal check
  if(board[0] === player && board[1] === player && board[2] === player) { winIndices = [0,1,2]; return true; }
  if(board[3] === player && board[4] === player && board[5] === player) { winIndices = [3,4,5]; return true; }
  if(board[6] === player && board[7] === player && board[8] === player) { winIndices = [6,7,8]; return true; }
  
  // Vertical check
  if(board[0] === player && board[3] === player && board[6] === player) { winIndices = [0,3,6]; return true; }
  if(board[1] === player && board[4] === player && board[7] === player) { winIndices = [1,4,7]; return true; }
  if(board[2] === player && board[5] === player && board[8] === player) { winIndices = [2,5,8]; return true; }
  
  // Diagonal check
  if(board[0] === player && board[4] === player && board[8] === player) { winIndices = [0,4,8]; return true; }
  if(board[2] === player && board[4] === player && board[6] === player) { winIndices = [2,4,6]; return true; }

  return false
}

// first run for AI(X) vs. Human(O)
function aiFirst() {
  var corners = [0,2,6,8];
  choice = corners[Math.floor(Math.random() * 4)];

  setTimeout(function() {
    mainBoard[choice] = turn;
    $("td")[choice].innerHTML = symbols[turn];
    turn = player;
  }, 600);
}

function resetMatch() {
  // clear all time outs
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }
  
  $("td").html("&nbsp;");
  $(".result").hide();
  mainBoard = [0,0,0,0,0,0,0,0,0];
  winIndices = [];
  turn = 1;
  if(singlePlayer && turn !== player) aiFirst();
}

function showResult(winner) {
  var resultStr = "";
  if(winner === player) resultStr = "Player X won!";
  else if(winner === (player === 1 ? 2 : 1)) resultStr = "Player O won!";
  else if(winner === 0) resultStr = "It's a draw!";
    
  $(".result").html(resultStr);  
  $(".result").show();
  
  for(var i = 0; i < winIndices.length; i++) {
    $("#" + winIndices[i] + ">i").css("color", "#77d894");
  }
}