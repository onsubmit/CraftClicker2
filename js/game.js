var Game = Class.define(
{
  ctor: function(oArgs)
  {
    this.player = new Player();
    this.worldSize = { rows: 3, cols: 3};
  },
  methods:
  {
    drawWorld: function(numRows, numCols)
    {
      var $table = $("#grid");
      for (var row = 0; row <= numRows; row++)
      {
        var $tr = $("<tr />");       
        for (var col = 0; col <= numCols; col++)
        {
          var $td = $("<td />");
          if (row > 0 && col > 0)
          {
            // World cell
            var self = this;
            $td.attr("data-pos", row + "," + col);
            $td.click({ row: row, col: col }, function(e)
            {
              self.movePlayer(e.data.row, e.data.col, 200);
            });
          }
          else if (row === 0 & col > 0)
          {
            // Column header
            $td.addClass("coords").text(col);
          }
          else if (col === 0 & row > 0)
          {
            // Row header
            $td.addClass("coords").text(row);
          }
          else
          {
            // Top-left corner -- empty
            $td.css("empty-cells", "hide");
          }
          
          $td.appendTo($tr);
        }
        
        $table.append($tr);
      }
      
      return this;
    },
    getWorldCell: function(row, col)
    {
      return $("td[data-pos='" + row + "," + col + "']");
    },
    getPlayer: function()
    {
      return $("#player");
    },
    getPlayerPosition: function()
    {
      var $player = this.getPlayer();
      if ($player.length)
      {
        var sPos = $player.attr("data-pos");
        var arrSplit = sPos.split(",");
        return { row: parseInt(arrSplit[0]), col: parseInt(arrSplit[1]) };
      }
      
      throw new Error("Player doesn't exist yet, dummy.");
    },
    getDistanceBetweenCells: function(oPos1, oPos2)
    {
      return Math.min(Math.abs(oPos1.row - oPos2.row), Math.abs(oPos1.col - oPos2.col));
    },
    movePlayer: function(row, col, duration)
    {

      var $player = this.getPlayer();
      if (!$player.length)
      {
        $player = $("<img/>",
        {
          id: "player",
          src: "images/Player.png",
        }).attr("data-pos", row + "," + col);
        
        this.getWorldCell(row, col).append($player.fadeIn());
        return this;
      }

      var self = this;
      (function step()
      {
        // Repeat until destination is reached
        var oPos = self.getPlayerPosition();
        if (oPos.row !== row || oPos.col !== col)
        {
          // Player can move in all 8 directions
          if (oPos.row < row) oPos.row += 1;
          if (oPos.row > row) oPos.row -= 1;
          if (oPos.col < col) oPos.col += 1;
          if (oPos.col > col) oPos.col -= 1;

          duration = self.player.speed || 1;
          $player.fadeOutAndRemove(duration, function()
          {
            $player = $("<img/>",
            {
              id: "player",
              src: "images/Player.png",
            }).attr("data-pos", oPos.row + "," + oPos.col);

            self.getWorldCell(oPos.row, oPos.col).append($player.fadeIn(duration, function()
            {
              step();
            }));
          });
        }
        else
        {
          moveQueue.shift();
          self.processMoveQueue();
        }
      })();
    },
    shiftPlayer: function(east, south, newPos)
    {
      var oPos = this.getPlayerPosition();
      var newRow = Math.max(1, Math.min(this.worldSize.rows, oPos.row + south));
      var newCol = Math.max(1, Math.min(this.worldSize.cols, oPos.col + east));
      this.movePlayer(newRow, newCol);
      newPos = [newRow, newCol];
      return this;
    },
    processMoveQueue: function()
    {
      if (moveQueue.length)
      {
        var key = moveQueue[0];
        if (key == 37)
        {
          // left
          game.shiftPlayer(-1, 0);
        }
        else if (key == 38)
        {
          // up
          game.shiftPlayer(0, -1);
        }
        else if (key == 39)
        {
          // right
          game.shiftPlayer(1, 0);
        }
        else if (key == 40)
        {
          // down
          game.shiftPlayer(0, 1);
        }
      }
    },
    drawItems: function()
    {
      var $itemList = $("#itemList");
      Items.iterate(function(item)
      {
        var $img = $("<img/>",
        {
          src: "images/" + item.id + item.name + ".png"
        }).appendTo($itemList);
      });
    }
  }
});

var game = new Game();

$(document).ready(function() {
  game.drawWorld(game.worldSize.rows, game.worldSize.cols).movePlayer(1, 1);
  game.drawItems();
});

var keys = {};
var moveQueue = [];
$(document).keydown(function(e)
{
  e = e || event;
  var bProcess = !moveQueue.length;
  if (e.keyCode >= 37 && e.keyCode <= 40)
  {
    moveQueue.push([e.keyCode]);
  }

  if (bProcess)
  {
    game.processMoveQueue();
  }
});