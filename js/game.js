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
  getCraftingTable: function()
  {
    return $("#craftingTable");
  },
  getCellsFromCraftingTable: function()
  {
    return $(".crafting.dropped");
  },
  getCellFromCraftingTable: function(row, col)
  {
    return $("#craftingTable td[data-cpos='" + row + "," + col + "']");
  },
  getItemInOutput: function()
  {
    return $(".crafted");
  },
  getCraftingOutput: function()
  {
    return $("#craftingOutput");
  },
  getInventoryContainer: function()
  {
    return $("#inventoryContainer");
  },
  getLeftColumn: function()
  {
    return $("#leftColumn");
  },
  getInventoryFilter: function()
  {
    return $("#inventoryFilter");
  },
  getIsInventoryMoveStacksChecked: function()
  {
    return $("#inventoryMoveStacks").is(":checked");
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
  getClearCraft: function()
  {
    return $("#clearCraft");
  },
  getCraftingTakeContainer: function()
  {
    return $("#craftingTakeContainer");
  },
  getCraftingTakeAmount: function()
  {
    return $("#craftingTakeAmount");
  },
  clearCraftingTable: function()
  {
    this.getCellsFromCraftingTable().remove();
  },
  clearCraftingOutput: function()
  {
    return this.getCraftingOutput().empty();
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
    this.getInventoryContainer().fadeIn();
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
                      containment: self.getLeftColumn(),
                      appendTo: self.getLeftColumn(),
                      snap: ".accept",
                      snapMode: "inner",
                      snapTolerance: 10,
                      distance: 10,
                      cursor: "move",
                      cursorAt: { bottom: -10, right: -10 },
                      helper: "clone",
                      opacity: 0.9,
                      scroll: false,
                      start: function(event, ui)
                      {
                        var $amount = $(ui.helper).find(".iconAmount");
                        var doDragStacks = self.getIsInventoryMoveStacksChecked();
                        if (doDragStacks)
                        {
                          var currentAmount = parseInt($amount.text() || 1);
                          if (currentAmount < Items.stackSize)
                          {
                            $amount.text(currentAmount);
                            var $elDrug = $(event.target);
                            var item = Items.get($elDrug.attr("data-item"));
                            self.getInventoryItem(item.id).fadeOut();
                          }
                          else
                          {
                            $amount.text(Items.stackSize);
                          }

                          amount = Math.min(amount, Items.stackSize);
                          
                        }
                        else
                        {
                          $amount.text(1);
                          $amount.hide();
                        }
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
      self.getInventoryItem(drop.item.id).show();
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
  },
  setupDropTargets: function()
  {
    var self = this;
    $(".accept").droppable(
                {
                  accept: ".iconImage",
                  tolerance: "touch",
                  drop: function(event, ui)
                  {
                    var $elDrug = $(ui.draggable);
                    var $elClone = $(ui.helper);
                    var wasFromInventory = !$elDrug.hasClass("crafting")
                    var itemName = $elDrug.attr("data-item");
                    var item = Items.get(itemName);

                    if (wasFromInventory)
                    {
                      // This event fires for each matched drop target.
                      // Ensure more than items that what the player has don't get dropped.
                      var $currentAmount = $elDrug.find(".iconAmount");
                      var $droppedAmount = $elClone.find(".iconAmount");
                      var currentAmount = parseInt($currentAmount.text() || 1);
                      var droppedAmount = parseInt($droppedAmount.text() || 1);
                      var newAmount = currentAmount - droppedAmount;
                      if (newAmount === 1)
                      {
                        $currentAmount.hide();
                      }
                      else if (newAmount === 0)
                      {
                        self.getInventoryItem(item.id).fadeOut();
                      }
                      else if (newAmount < 0)
                      {
                        return;
                      }

                      $currentAmount.text(newAmount);
                    }

                    var $icon = $("<div/>",
                                {
                                  id: "c" + item.id,
                                  class: "iconImage crafting",
                                  style: "background: url('" + item.image + "')"
                                })
                                .attr("data-item", item.name);

                    var $amount = $("<div/>",
                                  {
                                    id: "c" + item.id,
                                    class: "iconAmount"
                                  });

                    if (droppedAmount !== 1)
                    {
                      $amount.text(droppedAmount);
                    }

                    $icon.append($amount);

                    $icon.draggable({
                        containment: self.getLeftColumn(),
                        snap: ".accept",
                        snapMode: "inner",
                        snapTolerance: 10,
                        distance: 5,
                        cursor: "move",
                        helper: "clone",
                        opacity: 0.9,
                        scroll: false,
                        start: function(event, ui)
                        {
                          $(event.target).remove();
                          $(ui.helper).removeClass("dropped");
                          self.checkRecipe();

                          // Prevent the player from dragging an ingredient in the crafting table
                          // to in-between two (or four) squares, which would duplicate the ingredient.
                          // This might be possible to handle, but would be quite complex.
                          $(".accept").droppable("option", "tolerance", "fit");
                        },
                        stop: function(event, ui)
                        {
                          $(".accept").droppable("option", "tolerance", "touch");
                          var $elClone = $(ui.helper);
                          if (!$elClone.hasClass("dropped"))
                          {
                            var itemName = $elClone.attr("data-item");
                            var item = Items.get(itemName);
                            var $amount = $elClone.find(".iconAmount");
                            var amount = parseInt($amount.text() || 1);

                            var objReclaim = {};
                            objReclaim[item.id] = amount;
                            self.reclaimIngredients(objReclaim);
                          }

                          $(ui.helper).remove();
                          self.checkRecipe();
                        }
                    });

                    $icon.addClass("dropped");
                    $(ui.helper).addClass("dropped");

                    var $current = $(event.target).find(".iconimage");
                    if ($current.length)
                    {
                      var currentIngredient = Items.get($current.attr("data-item"));
                      var newIngredient = Items.get($icon.attr("data-item"));
                      var $currentIngredientAmount = $current.find(".iconAmount");
                      var currentIngredientAmount = parseInt($currentIngredientAmount.text() || 1);
                      var $newIngredientAmount = $icon.find(".iconAmount");
                      var newIngredientAmount = parseInt($newIngredientAmount.text() || 1);

                      var $parent = $(ui.helper).parent();
                      if (currentIngredient == newIngredient)
                      {
                        if (!$parent.hasClass("accept"))
                        {
                          // There is already the same item in this square. Add to it.
                          $newIngredientAmount.text(currentIngredientAmount + newIngredientAmount);
                        }
                        else
                        {
                          // TODO: Needed at 2x2?
                        }
                      }
                      else
                      {                        
                        if (!$parent.hasClass("accept"))
                        {
                          // This happens when the player drops an item from the inventory.
                          // Swapping requires reclaiming the currently existing ingredient
                          // back to the inventory.
                          var objReclaim = {};
                          objReclaim[currentIngredient.id] = currentIngredientAmount;
                          self.reclaimIngredients(objReclaim);
                        }
                        else
                        {
                          // There is already a different item in this square. Swap them.
                          $parent.empty().append($current);
                        }
                      }
                    }

                    $(event.target).empty().append($icon);
                    self.checkRecipe();

                    if (wasFromInventory && currentAmount === 0)
                    {
                      self.getInventoryItem(item.id).fadeOut();
                    }
                  }
                });
  },
  getIngredientsFromCraftingTable: function()
  {
    var $ingredients = this.getCellsFromCraftingTable();

    var table = document.getElementById("craftingTable");
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;
    var arrIngredients = (new Array(rows)).assignEach(function() { return new Array(cols); });

    for (var row = 0; row < rows; row++)
    {
      for (var col = 0; col < cols; col++)
      {
        var $cell = $(table.rows[row].cells[col]);
        var $ingredient = $cell.find(".crafting.dropped");
        if ($ingredient.length)
        {
          var item = Items.get($ingredient.attr("data-item"));
          var amount = parseInt($ingredient.find(".iconAmount").text() || 1);
          arrIngredients[row][col] = 
          {
            item: item,
            amount: amount
          };
        }
      }
    }

    return arrIngredients;
  },
  checkRecipe: function()
  {
    var self = this;
    this.clearCraftingOutput();
    var arrIngredients = self.getIngredientsFromCraftingTable();
    var craftableItem = self.checkIngredients(arrIngredients);
    if (craftableItem)
    {
      var $icon = $("<div/>",
                  {
                    class: "crafted iconImage",
                    style: "background: url('" + craftableItem.item.image + "')"
                  });

      var $amount = $("<div/>",
                    {
                      class: "iconAmount"
                    });

      var makes = craftableItem.item.recipe.makes;
      var amount = makes * craftableItem.amount;
      if (amount !== 1)
      {
        $amount.text(amount);
      }

      if (craftableItem.amount > 1)
      {
        this.getCraftingTakeContainer().show();
      }
      else
      {
        this.getCraftingTakeContainer().hide();
      }

      $icon.append($amount);
      $icon.mousedown(
      {
        craftableItem: craftableItem,
        arrIngredients: arrIngredients,
        maxAmount: amount

      }, function(e)
      {
        var amountToCraft = parseInt($(this).text());
        var arrDrops = 
        [
          {
            item: e.data.craftableItem.item,
            amount: amountToCraft
          }
        ];

        if (amountToCraft < e.data.maxAmount)
        {
          var decrement = ((e.data.maxAmount - amountToCraft) / e.data.craftableItem.item.recipe.makes);
          e.data.arrIngredients.forEach2d(function(ingredient)
          {
            if (ingredient)
            {
              ingredient.amount -= decrement;
            }
          });
        }

        self.player.inventory.consume(e.data.arrIngredients);
        self.player.inventory.merge(arrDrops);
        self.drawInventory(arrDrops);
        self.clearCraftingOutput();
        if (amountToCraft == e.data.maxAmount)
        {
          self.clearCraftingTable();
        }
        else
        {
          for (var row = 0, rows = e.data.arrIngredients.length; row < rows; row++)
          {
            for (var col = 0, cols = e.data.arrIngredients[row].length; col < cols; col++)
            {
              var $ingredient = self.getCellFromCraftingTable(row, col);
              var $ingredientAmount = $ingredient.find(".iconAmount");
              var ingredientAmount = parseInt($ingredientAmount.text() || 1);
              var ingredient = e.data.arrIngredients[row][col];
              var newAmount = ingredientAmount - ingredient.amount;
              $ingredient.find(".iconAmount").text(newAmount);
            }
          }

          self.checkRecipe();
        }
      });
                  
      this.getCraftingOutput().append($icon);

      if (amount > makes)
      {
        this.getCraftingTakeAmount()
          .spinner("option", "min", makes)
          .spinner("option", "max", amount)
          .spinner("option", "step", makes)
          .val(amount);

        this.getCraftingTakeContainer().show();
      }
      else
      {
        this.getCraftingTakeAmount().hide();
      }
    }
  },
  checkIngredients: function(arrIngredients)
  {
    if (arrIngredients.every2d(function(ingredient) { return !ingredient; }))
    {
      return false;
    }

    var craftableItem = null;
    var craftableAmount = 0;
    Items.some(function(item)
    {
      craftableAmount = item.recipe && item.recipe.check(arrIngredients);
      if (craftableAmount)
      {
        craftableItem = item;
      }

      return craftableAmount;
    });

    if (craftableAmount > 0)
    {
      var objRet = 
      {
        item: craftableItem,
        amount: craftableAmount
      };

      return objRet;
    }
    else
    {
      return null;
    }
  },
  setupClearCrafting: function()
  {
    var self = this;
    this.getClearCraft().click(function()
    {
      var objReclaim = {};
      var arrIngredients = self.getIngredientsFromCraftingTable();
      arrIngredients.forEach2d(function(ingredient)
      {
        if (!ingredient) return;
        if (!objReclaim[ingredient.item.id])
        {
          objReclaim[ingredient.item.id] = ingredient.amount;
        }
        else
        {
          objReclaim[ingredient.item.id] += ingredient.amount;
        }
      });

      self.reclaimIngredients(objReclaim);
      self.getCellsFromCraftingTable().fadeOutAndRemove();
      self.getItemInOutput().fadeOutAndRemove();
    });
  },
  reclaimIngredients: function(objReclaim)
  {
    for (var id in objReclaim)
    {
      var $item = this.getInventoryItem(id);
      var $currentAmount = $item.find(".iconAmount");
      var currentAmount = parseInt($currentAmount.text() || 1);
      var newAmount = currentAmount + objReclaim[id];
      $currentAmount.text(newAmount);
      if (newAmount === 1)
      {
        // Don't show a badge when only one exists
        $currentAmount.hide();
      }

      if (currentAmount === 0)
      {
        if (newAmount !== 1)
        {
          $currentAmount.show();
        }

        $item.fadeIn();
      }
      else if (currentAmount === 1)
      {
        $currentAmount.show();
      }
    }
  },
  setupTakeSpinner: function()
  {
    var self = this;
    this.getCraftingTakeAmount().spinner(
    {
      min: 1,
      max: 1,
      step: 1,
      start: function(event, ui)
      {
        var $el = $(event.target);
        $el.attr("data-oldval", $el.val());

      },
      stop: function(event, ui)
      {
        var $el = $(event.target);
        var oldVal = $el.attr("data-oldval");
        var newVal = $el.val();
        if (oldVal === newVal) return;
        self.getCraftingOutput().find(".iconAmount").text(newVal);
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
  game.setupFilters();
  game.setupDropTargets();
  game.setupClearCrafting();
  game.setupTakeSpinner();
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

(function preloadImages()
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
    "shadows/CraftingTable",
    "ArrowRight",
    "Player",
    "World"
  ];

  Items.forEach(function(item) { images.push(item.name); });
  images.forEach(function(itemName)
  {
    setTimeout(function() { (new Image()).src = "images/" + itemName + ".png"; }, 1000);
  });
})();