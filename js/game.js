function Game(oArgs)
{
  this._minAnimationDuration = 25;
  this.player = new Player();
  this.world = new World({ rows: 3, cols: 3});
}

$.extend(Game.prototype,
{
  getPlayer: function()
  {
    return $("#player");
  },
  drawWorld: function(numRows, numCols)
  {
    var self = this;
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
          $td.attr("data-pos", row + "," + col);
          $td.click({ row: row, col: col }, function(e)
          {
            self.player.setDestination(e.data.row, e.data.col);
            self.movePlayer();
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
  createPlayer: function(row, col, complete)
  {
    var $player = $("<img/>",
    {
      id: "player",
      src: "images/Player.png",
    }).attr("data-pos", row + "," + col);

    this.player.setPosition(row, col);
    var $worldCell = this.world.getCell(row, col);
    if (this.player.speed < this._minAnimationDuration)
    {
      $worldCell.append($player);
    }
    else
    {
      $worldCell.append($player.fadeIn(this.player.speed, complete));
    }
    
    return $player;
  },
  movePlayer: function()
  {
    var self = this;
    var $player = this.getPlayer();
    (function step()
    {
      // Repeat until destination is reached
      var oVector = self.player.vector;
      var row = oVector.row;
      var col = oVector.col;
      var destRow = oVector.destRow;
      var destCol = oVector.destCol;
      if (row !== destRow || col !== destCol)
      {
        // Player can move in all 8 directions
        if (row < destRow) row += 1;
        if (row > destRow) row -= 1;
        if (col < destCol) col += 1;
        if (col > destCol) col -= 1;

        if (self.player.speed < this._minAnimationDuration)
        {
          $player.remove();
          $player = self.createPlayer(row, col);
          step();
        }
        else
        {
          $player.fadeOutAndRemove(self.player.speed, function()
          {
            $player = self.createPlayer(row, col, function() { step(); });
          });
        }
      }
    })();
  },
  drawItems: function()
  {
    var $itemList = $("#itemList");
    Items.forEach(function(item)
    {
      var $img = $("<img/>",
      {
        src: "images/" + item.name + ".png",
        class: "item",
        title: item.name
      }).appendTo($itemList);
    });
  }
});

var game = new Game();

$(document).ready(function()
{
  game.drawWorld(game.world.size.rows, game.world.size.cols).createPlayer(1, 1);
  game.drawItems();
});