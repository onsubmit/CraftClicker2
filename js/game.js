function Game(oArgs)
{
  this._minAnimationDuration = 1;
  this.player = new Player();
  this.world = new World({ rows: 3, cols: 3});
}

$.extend(Game.prototype,
{
  getPlayer: function()
  {
    return $("#player");
  },
  getZoomIn: function()
  {
    return $("#zoomIn");
  },
  getZoomOut: function()
  {
    return $("#zoomOut");
  },
  getGather: function()
  {
    return $("#gather");
  },
  getWorld: function()
  {
    return $("#world");
  },
  drawWorld: function(numRows, numCols)
  {
    var self = this;
    var $table = this.getWorld();
    for (var row = -1; row < numRows; row++)
    {
      var $tr = $("<tr />");       
      for (var col = -1; col < numCols; col++)
      {
        var $td = $("<td />").attr("data-pos", row + "," + col);
        if (row >= 0 && col >= 0)
        {
          var eventData = { row: row, col: col };
          $td.click(eventData, function(e)
          {
            self.world.unhighlightCell().highlightCell(e.data.row, e.data.col);
            self.player.setDestination(e.data.row, e.data.col);
            self.movePlayer();
          });
        }
        else
        {
          $td.addClass("coords");
          if (row === -1 && col >= 0)
          {
            // Column header
            $td.text(col);
          }
          else if (col === -1 && row >= 0)
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
  zoomIn: function()
  {
    var self = this;
    var row = this.player.vector.row;
    var col = this.player.vector.col;

    this.world.getContainer().fadeOut("fast", function()
    {
      self.world.getTiles().hide();
      self.world.drawTile(row, col).show();
      self.world.getTileContainer().fadeIn("fast");
    });

    return this;
  },
  zoomOut: function()
  {
    var self = this;
    this.world.getTileContainer().fadeOut("fast", function() { self.world.getContainer().fadeIn("fast"); });
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
    this.world.activateCoord(-1, col).activateCoord(row, -1);
    return $player;
  },
  movePlayer: function()
  {
    var self = this;
    var $player = this.getPlayer();
    self.getZoomIn().disable();
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
        self.world.deactivateCoord(-1, col);
      }

      if (row !== destRow)
      {
        fMoveRequired = true;
        self.world.deactivateCoord(row, -1);
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
      else
      {
        self.getZoomIn().enable();
      }
    })();
  },
  gather: function()
  {
    var arrDrops = this.world.getTile(this.player.vector.row, this.player.vector.col).gather();
    this.player.inventory.merge(arrDrops);
  },
  drawItems: function()
  {
    var $itemList = $("#itemList");
    Items.forEach(function(item)
    {
      if (!item.hidden)
      {
        var $img = $("<img/>",
        {
          src: "images/" + item.name + ".png",
          class: "item",
          title: item.name
        }).appendTo($itemList);
      }
    });
  }
});

var game = new Game();

$(document).ready(function()
{
  game.drawWorld(game.world.size.rows, game.world.size.cols).createPlayer(0, 0);
  game.world.highlightCell(0, 0);
  game.drawItems();
  game.getZoomIn().click(function() { game.zoomIn(); });
  game.getZoomOut().click(function() { game.zoomOut(); });
  game.getGather().click(function() { game.gather(); });
});