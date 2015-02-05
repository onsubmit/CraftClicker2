preloadImages();

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
  getInventoryList: function()
  {
    return $("#inventoryList");
  },
  getInventoryItem: function(itemId)
  {
    return $("#inv" + itemId);
  },
  getInventoryAmount: function(itemId)
  {
    return $("#inva" + itemId);
  },
  getInventoryIcon: function(itemId)
  {
    return $("#invi" + itemId);
  },
  getSaveData: function()
  {
    var objGame = btoa(JSON.stringify(game));
    return objGame;
  },
  save: function()
  {
    localStorage['CraftClicker2'] = game.getSaveData();
  },
  load: function()
  {
    var objGame = JSON.parse(atob(localStorage['CraftClicker2']));
    this.recursiveLoad(game, objGame);
  },
  recursiveLoad: function(current, saved)
  {
    for (var prop in saved)
    {
      // Iterate through each object property
      if (current.hasOwnProperty(prop))
      {
        // Current object has the same property as the saved object
        if (current[prop] != null && Object.keys(current[prop]).length === 0)
        {
          // Don't overwrite objects, only properties.
          // We don't want to kill any methods.
          current[prop] = saved[prop];
        }

        // We must go deeper
        this.recursiveLoad(current[prop], saved[prop]);
      }
    }
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
    if (arrDrops)
    {
      this.player.inventory.merge(arrDrops);
      this.drawInventory(arrDrops);
    }
  },
  drawInventory: function(arrDrops)
  {
    var self = this;
    var $list = this.getInventoryList();

    arrDrops.forEach(function(drop)
    {
      var $item = self.getInventoryItem(drop.item.id);
      if (!$item.length)
      {
        var $icon = $("<div/>", 
                    {
                      id: "invi" + drop.item.id,
                      class: "invIcon floatLeft",
                      style: "background: url('" + drop.item.image + "')"
                    }).append($("<div/>",
                      {
                        id: "inva" + drop.item.id,
                        class: "invAmount"
                      })
                    );

        var $name = $("<div/>",
                    {
                      class: "invName",
                      text: drop.item.name
                    });

        $item = $("<li/>", 
                {
                  id: "inv" + drop.item.id,
                }).attr("data-invid", drop.item.id).attr("data-invname", drop.item.name)
                .append($icon).append($name);

        var $insertBefore = null;
        $("li[id*='inv']").each(function()
        {
          var strName = $(this).attr("data-invname");
          if (strName > drop.item.name)
          {
            var id = parseInt($(this).attr("data-invid"));
            $insertBefore = $(this);
            return false;
          }
        });

        if ($insertBefore)
        {
          $item.insertBefore($insertBefore);
        }
        else
        {
          $list.append($item);
        }
      }

      var amount = self.player.inventory.items[drop.item.id];
      var strTitle = Number(amount).toLocaleString('en') + " " + drop.item.name + (amount !== 1 ? drop.item.pluralSuffix : "");
      self.getInventoryIcon(drop.item.id).attr("title", strTitle);
      self.getInventoryAmount(drop.item.id).text(self.getAmountForBadge(amount));
    });
  },
  getAmountForBadge: function(amount)
  {
    if (amount < 1e3)  return amount;
    if (amount < 1e6)  return (amount / 1e3).toString().substr(0, 3).trimEnd(".") + "k";
    if (amount < 1e9)  return (amount / 1e6).toString().substr(0, 3).trimEnd(".") + "M";
    if (amount < 1e12) return (amount / 1e9).toString().substr(0, 3).trimEnd(".") + "G";
    if (amount < 1e15) return (amount / 1e12).toString().substr(0, 3).trimEnd(".") + "T";
    if (amount < 1e15) return (amount / 1e12).toString().substr(0, 3).trimEnd(".") + "P";
    if (amount < 1e18) return (amount / 1e15).toString().substr(0, 3).trimEnd(".") + "E";
    if (amount < 1e21) return (amount / 1e18).toString().substr(0, 3).trimEnd(".") + "Z";
    if (amount < 1e24) return (amount / 1e21).toString().substr(0, 3).trimEnd(".") + "Y";
    return "\u221E";
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
          src: item.image,
          class: "item",
          title: item.name
        }).appendTo($itemList);
      };
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

$(document).keypress(function(e) {
  e.preventDefault(); // Prevent page down on hitting space bar
  if (e.which == 71 || e.which == 103 && game.getGather().isVisible()) { // '[Gg]'
    game.gather();
  }
});

function preloadImages()
{
  var images =
  [
    "shadows/Bottom",
    "shadows/BottomRight",
    "shadows/BottomRightCorner",
    "shadows/DepthShade",
    "shadows/Left",
    "shadows/Right",
    "shadows/Top",
    "shadows/TopLeft",
    "shadows/TopLeftCorner"
  ];

  Items.forEach(function(item) { images.push(item.name); });
  images.forEach(function(itemName)
  {
    setTimeout(function() { (new Image()).src = "images/" + itemName + ".png"; }, 1000);
  });
}