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
  getWorldContainer: function()
  {
    return $("#worldContainer");
  },
  getInventoryContainer: function()
  {
    return $("#inventoryContainer");
  },
  getInventoryFilter: function()
  {
    return $("#inventoryFilter");
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
  getItemFilter: function()
  {
    return $("#itemFilter");
  },
  getItemList: function()
  {
    return $("#itemList");
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
  setupFilters: function()
  {
    var self = this;
    var itemFilter = function($parent, filter)
    {
      filter = (filter && filter.toLowerCase()) || "";

      var $listItems = $parent.find(".filterableItem");
      var $itemsToHide = $listItems.filter(function()
      {
        return $(this).attr("data-itemname").toLowerCase().indexOf(filter) === -1;
      });

      var $itemsToShow = $listItems.filter(function()
      {
        return $(this).attr("data-itemname").toLowerCase().indexOf(filter) > -1;
      });

      return {
        $itemsToHide: $itemsToHide,
        $itemsToShow: $itemsToShow
      };
    };

    var $inventoryFilter = game.getInventoryFilter();
    $inventoryFilter
      .keypress(function(e) { e.stopPropagation(); })
      .keyup(
        {
          filterFunc: itemFilter,
          $elTb: $inventoryFilter,
          $parent: self.getInventoryList()
        }, function(e)
      {
        e.stopPropagation();
        game.filter(e);
      });

    var $itemFilter = game.getItemFilter();
    $itemFilter
      .keypress(function(e) { e.stopPropagation(); })
      .keyup(
        {
          filterFunc: itemFilter,
          $elTb: $itemFilter,
          $parent: self.getItemList()
        }, function(e)
      {
        e.stopPropagation();
        game.filter(e);
      });
  },
  filter: function(e)
  {
    var $elTb = e.data.$elTb;
    var filter = $elTb.val();
    var items = e.data.filterFunc(e.data.$parent, filter);
    items.$itemsToHide.hide();
    items.$itemsToShow.show();
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
                      class: "iconImage floatLeft",
                      style: "background: url('" + drop.item.image + "')"
                    }).attr("data-item", drop.item.name)
                      .append($("<div/>",
                      {
                        id: "inva" + drop.item.id,
                        class: "iconAmount"
                      })
                    ).draggable({
                      containment: self.getInventoryContainer(),
                      snap: ".accept",
                      snapMode: "inner",
                      snapTolerance: 10,
                      distance: 10,
                      cursor: "move",
                      cursorAt: { bottom: -10, right: -10 },
                      helper: "clone",
                      opacity: 0.9,
                      scroll: false,
                      drag: function(event, ui)
                      {
                        //var itemName = $(ui.draggable).attr("data-item");
                      }
                    });

        var $name = $("<div/>",
                    {
                      class: "invName",
                      text: drop.item.name
                    });

        $item = $("<li/>", 
                {
                  id: "inv" + drop.item.id,
                  class: "invListItem filterableItem"
                }).attr("data-invid", drop.item.id).attr("data-itemname", drop.item.name)
                .append($icon).append($name);

        var $insertBefore = null;
        $("li[id*='inv']").each(function()
        {
          var strName = $(this).attr("data-itemname");
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
    var format = function(display, suffix)
    {
      return display.toString().substr(0, 3).trimEnd(".") + suffix;
    };

    if (amount < 1e3)  return amount;
    if (amount < 1e6)  return format(amount / 1e3, "k");
    if (amount < 1e9)  return format(amount / 1e6, "M");
    if (amount < 1e12) return format(amount / 1e9, "G");
    if (amount < 1e15) return format(amount / 1e12, "T");
    if (amount < 1e15) return format(amount / 1e12, "P");
    if (amount < 1e18) return format(amount / 1e15, "E");
    if (amount < 1e21) return format(amount / 1e18, "Z");
    if (amount < 1e24) return format(amount / 1e21, "Y");

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
          class: "itemListItem filterableItem",
          title: item.name
        }).attr("data-itemname", item.name)
        .appendTo($itemList);
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
  game.setupFilters();

  $(".accept").droppable(
              {
                accept: ".iconImage",
                tolerance: "touch",
                drop: function(event, ui)
                {
                  var itemName = $(ui.draggable).attr("data-item");
                  var item = Items.get(itemName);
                  var $icon = $("<div/>", 
                    {
                      id: "c" + item.id,
                      class: "iconImage",
                      style: "background: url('" + item.image + "')"
                    }).attr("data-item", item.name)
                      .append($("<div/>",
                        {
                          id: "c" + item.id,
                          class: "iconAmount"
                        })//.text(1)
                      );
                  $(event.target).empty().append($icon);
                }
              });
  });

  $(document).keypress(function(e)
  { 
    var tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea")
    {
      return;
    }

    //e.preventDefault(); // Prevent page down on hitting space bar
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
    "shadows/TopLeftCorner",
    "shadows/CraftingTable"
  ];

  Items.forEach(function(item) { images.push(item.name); });
  images.forEach(function(itemName)
  {
    setTimeout(function() { (new Image()).src = "images/" + itemName + ".png"; }, 1000);
  });
}