function Game(oArgs)
{
  this._minAnimationDuration = 1;
  this.player = new Player();
  this.world = new World({ rows: 4, cols: 4});
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
        var $td = $("<td />").attr("data-pos", row + "," + col);
        if (row > 0 && col > 0)
        {
          // World cell
          $td.click({ row: row, col: col }, function(e)
          {
            self.world.unhighlightCell().highlightCell(e.data.row, e.data.col);
            self.player.setDestination(e.data.row, e.data.col);
            self.movePlayer();
          });
        }
        else
        {
          $td.addClass("coords");
          if (row === 0 && col > 0)
          {
            // Column header
            $td.text(col);
          }
          else if (col === 0 && row > 0)
          {
            // Row header
            $td.text(row);
          }
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
    $worldCell.append($player.fadeIn(Math.max(this.player.speed, this._minAnimationDuration), complete));
    this.world.activateCoord(0, col).activateCoord(row, 0);
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

      var fMoveRequired = false;
      if (col !== destCol)
      {
        fMoveRequired = true;
        self.world.deactivateCoord(0, col);
      }

      if (row !== destRow)
      {
        fMoveRequired = true;
        self.world.deactivateCoord(row, 0);
      }

      if (fMoveRequired)
      {
        // Player can move in all 8 directions
        if (row < destRow) row += 1;
        if (row > destRow) row -= 1;
        if (col < destCol) col += 1;
        if (col > destCol) col -= 1;
        
        $player.fadeOutAndRemove(Math.max(self.player.speed, this._minAnimationDuration), function()
        {
          $player = self.createPlayer(row, col, function() { step(); });
        });
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
  game.world.highlightCell(1, 1);
  game.drawItems();
});