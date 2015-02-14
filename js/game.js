function Game(args)
{
  args = args || {};
  args.clone = args.clone || {};
  this.version = args.clone.version || 0.01;
  this.autosave = args.clone.autosave || true;
  this.autoSaveId = args.clone.autoSaveId || -1;
  this.minAnimationDuration = args.clone.minAnimationDuration || 1;
  this.currentView = args.clone.currentView || View.World;
  this.player = new Player(args.clone.player && { clone: args.clone.player });
  this.world = new World((args.clone.world && { clone: args.clone.world }) || { rows: 3, cols: 3 });

  $.extend(Game.prototype,
  {
    getSaveData: function()
    {
      var objGame = btoa(JSON.stringify(game));
      return objGame;
    },
    save: function(close)
    {
      localStorage['CraftClicker2'] = game.getSaveData();

      if(close)
      {
        game.getOptionsDialog().dialog("close");
      }
    },
    reset: function()
    {
      if (confirm('Reset everything?'))
      {
        localStorage.removeItem('CraftClicker2');
        $(window).off('beforeunload');
        window.location.reload()
      }
    },
    export: function()
    {
      this.getExportDialog().dialog("open");
      this.getExportData().val(this.getSaveData()).select();
    },
    import: function()
    {
      this.getImportDialog().dialog("open");
    },
    showOptionsDialog: function()
    {
      this.getOptionsDialog().dialog("open");
    },
    drawWorld: function(numRows, numCols)
    {
      this.world.getTiles().remove();
      var $table = this.getWorld().empty();
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
              game.world.unhighlightCell().highlightCell(e.data.row, e.data.col);
              game.player.setDestination(e.data.row, e.data.col);
              game.movePlayer();
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
      
      this.createPlayer(this.player.vector.row, this.player.vector.col);
      this.world.highlightCell(this.player.vector.row, this.player.vector.col);

      if (this.currentView === View.Tile)
      {
        this.zoomIn(true /* zoomInstantly */);
      }

      return this;
    },
    zoomIn: function(zoomInstantly)
    {
      this.currentView = View.Tile;
      var row = this.player.vector.row;
      var col = this.player.vector.col;
      
      if (zoomInstantly)
      {
        game.world.getContainer().hide();
        game.world.getTiles().show();
        game.world.drawTile(row, col).show();
        game.world.getTile(row, col).fixShadows();
        game.world.getTileContainer().show();
      }
      else
      {
        game.getGather().disable();
        game.getZoomOut().disable();
        this.world.getContainer().fadeOut("fast", function()
        {
          game.world.getTiles().hide();
          game.world.drawTile(row, col).show();
          game.world.getTile(row, col).fixShadows();
          game.world.getTileContainer().fadeIn("fast", function()
          {
            game.getGather().enable();
            game.getZoomOut().enable();
          });
        });
      }

      return this;
    },
    zoomOut: function()
    {
      game.getZoomIn().disable();
      this.currentView = View.World;
      this.world.getTileContainer().fadeOut("fast", function()
        {
          game.world.getContainer().fadeIn("fast", function()
          {
            game.getZoomIn().enable();
          });
        });
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
      $worldCell.append($player.fadeIn(Math.max(this.player.speed, this.minAnimationDuration), complete));
      this.world.activateCoord(-1, col).activateCoord(row, -1);
      return $player;
    },
    movePlayer: function()
    {
      var $player = this.getPlayer();
      game.getZoomIn().disable();
      (function step()
      {
        // Repeat until destination is reached
        var oVector = game.player.vector;
        var row = oVector.row;
        var col = oVector.col;
        var destRow = oVector.destRow;
        var destCol = oVector.destCol;

        var fMoveRequired = false;
        if (col !== destCol)
        {
          fMoveRequired = true;
          game.world.deactivateCoord(-1, col);
        }

        if (row !== destRow)
        {
          fMoveRequired = true;
          game.world.deactivateCoord(row, -1);
        }

        if (fMoveRequired)
        {
          // Player can move in all 8 directions
          if (row < destRow) row += 1;
          if (row > destRow) row -= 1;
          if (col < destCol) col += 1;
          if (col > destCol) col -= 1;
          
          $player.fadeOutAndRemove(Math.max(game.player.speed, this.minAnimationDuration), function()
          {
            $player = game.createPlayer(row, col, function() { step(); });
          });
        }
        else
        {
          game.getZoomIn().enable();
        }
      })();
    },
    setupFilters: function()
    {
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
            $parent: game.getInventoryList()
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
            $parent: game.getItemList()
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
      this.getInventoryContainer().fadeIn();
      var $list = this.getInventoryList();

      arrDrops.forEach(function(drop)
      {
        var $item = game.getInventoryItem(drop.item.id);
        var amount = game.player.inventory.items[drop.item.id];
        game.drawInventoryItem($list, $item, drop.item, amount);
      });
    },
    drawInventoryFromLoad: function()
    {
      var count = 0;
      var $list = this.getInventoryList();
      for (var id in this.player.inventory.items)
      {
        var $item = this.getInventoryItem(id);
        var item = Items.get(id);
        var amount = this.player.inventory.items[id];

        if (amount > 0)
        {
          this.drawInventoryItem($list, $item, item, amount);
          count++;
        }
      };

      if (count)
      {
        this.getInventoryContainer().fadeIn();
      }
    },
    drawInventoryItem: function($list, $item, item, amount)
    {
      if (!$item.length)
      {
        var $icon = $("<div/>", 
        {
          id: "invi" + item.id,
          class: "iconImage floatLeft",
          style: "background: url('" + item.image + "')"
        }).attr("data-item", item.name)
          .append($("<div/>",
          {
            id: "inva" + item.id,
            class: "iconAmount"
          })
        ).draggable({
          containment: game.getLeftColumn(),
          appendTo: game.getLeftColumn(),
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
            var doDragStacks = game.getIsInventoryMoveStacksChecked();
            if (doDragStacks)
            {
              var currentAmount = parseInt($amount.text() || 1);
              if (currentAmount < Items.stackSize)
              {
                $amount.text(currentAmount);
                var $elDrug = $(event.target);
                var item = Items.get($elDrug.attr("data-item"));
                game.getInventoryItem(item.id).fadeOut();
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
          text: item.name
        });

        $item = $("<li/>", 
        {
          id: "inv" + item.id,
          class: "invListItem filterableItem"
        }).attr("data-invid", item.id).attr("data-itemname", item.name)
        .append($icon).append($name);

        var $insertBefore = null;
        $("li[id*='inv']").each(function()
        {
          var strName = $(this).attr("data-itemname");
          if (strName > item.name)
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

      var strTitle = Number(amount).toLocaleString('en') + " " + item.name + (amount !== 1 ? item.pluralSuffix : "");
      game.getInventoryItem(item.id).show();
      game.getInventoryIcon(item.id).attr("title", strTitle);
      game.getInventoryAmount(item.id).text(game.getAmountForBadge(amount));
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
            game.player.inventory.consume(item, droppedAmount);

            if (newAmount === 1)
            {
              $currentAmount.hide();
            }
            else if (newAmount === 0)
            {
              game.getInventoryItem(item.id).fadeOut();
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

          $icon.draggable(
          {
            containment: game.getLeftColumn(),
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
              game.checkRecipe();

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
                game.reclaimIngredients(objReclaim);
              }

              $(ui.helper).remove();
              game.checkRecipe();
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
                game.reclaimIngredients(objReclaim);
              }
              else
              {
                // There is already a different item in this square. Swap them.
                $parent.empty().append($current);
              }
            }
          }

          $(event.target).empty().append($icon);
          game.checkRecipe();

          if (wasFromInventory && currentAmount === 0)
          {
            game.getInventoryItem(item.id).fadeOut();
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
      this.clearCraftingOutput();
      var arrIngredients = game.getIngredientsFromCraftingTable();
      var craftableItem = game.checkIngredients(arrIngredients);
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

          game.player.inventory.merge(arrDrops);
          game.drawInventory(arrDrops);
          game.clearCraftingOutput();
          if (amountToCraft == e.data.maxAmount)
          {
            game.clearCraftingTable();
            game.getCraftingTakeContainer().hide();
          }
          else
          {
            for (var row = 0, rows = e.data.arrIngredients.length; row < rows; row++)
            {
              for (var col = 0, cols = e.data.arrIngredients[row].length; col < cols; col++)
              {
                var $ingredient = game.getCellFromCraftingTable(row, col);
                var $ingredientAmount = $ingredient.find(".iconAmount");
                var ingredientAmount = parseInt($ingredientAmount.text() || 1);
                var ingredient = e.data.arrIngredients[row][col];
                var newAmount = ingredientAmount - ingredient.amount;
                $ingredient.find(".iconAmount").text(newAmount);
              }
            }

            game.checkRecipe();
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
      this.getClearCraft().click(function()
      {
        game.reclaimCraftingArea();
      });
    },
    reclaimCraftingArea: function()
    {
      var objReclaim = {};
      var arrIngredients = this.getIngredientsFromCraftingTable();
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

      this.reclaimIngredients(objReclaim);
      this.getCellsFromCraftingTable().fadeOutAndRemove();
      this.getItemInOutput().fadeOutAndRemove();
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
        this.player.inventory.mergeById(id, newAmount);

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
    setupButtons: function()
    {
      this.getZoomIn().click(function() { game.zoomIn(); });
      this.getZoomOut().click(function() { game.zoomOut(); });
      this.getGather().click(function() { game.gather(); });
      this.getOptions().click(function() { game.showOptionsDialog(); });
      this.getSave().click(function() { game.save(true); });
      this.getLoad().click(function() { load(true); });
      this.getExport().click(function() { game.export(); });
      this.getImport().click(function() { game.import(); });
      this.getReset().click(function() { game.reset(); });
    },
    setupTakeSpinner: function()
    {
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
          game.getCraftingOutput().find(".iconAmount").text(newVal);
        }
      });
    },
    setupDialogs: function()
    {
      var commonDialogOptions =
      {
        autoOpen: false,
        modal: false,
        closeOnEscape: true,
        width: 400,
        maxWidth: 400,
        height: 300,
        maxHeight: 300,
        height: "auto",
        show: true,
        open: function(event, ui)
        {
          var overrides = ['.ui-dialog', '.ui-widget-overlay', '.ui-widget textarea' ];
          overrides.forEach(function(o) { $(o).addClass('override'); });
        }
      };

      this.getExportDialog().dialog(commonDialogOptions);
      this.getImportDialog().dialog($.extend({}, commonDialogOptions, 
      {
        buttons:
        [
          {
            text: "Import",
            icons:
            {
              primary: "ui-icon-check"
            },
            click: function()
            {
              var saveData = game.getImportData().val();
              $(this).dialog("close");
              game.getOptionsDialog().dialog("close");
              load(false, saveData);
            }
          }
        ]
      }));

      this.getOptionsDialog().dialog($.extend({}, commonDialogOptions,  { resizable: false, modal: true }));
    }
  });
}

var View =
{
  World:   0,
  Tile:    1
}

var game = null;
var load = function(prompt, saveData)
{
  if (prompt)
  {
    if (!confirm('Load save state?'))
    {
      return;
    }

    game.getOptionsDialog().dialog("close");
  }
  
  var data = saveData || localStorage['CraftClicker2'];
  if (data)
  {
    var savedGame = JSON.parse(atob(data));
    game = new Game({ clone: savedGame });
    game.drawInventoryFromLoad();
    game.getAutoSave().attr('checked', this.autosave);
  }
  else
  {
    game = new Game();
  }

  game.drawWorld(game.world.size.rows, game.world.size.cols);
}

$(document).ready(function()
{
  load(false /* prompt*/, null /* saveData */);
  game.drawItems();
  game.setupButtons();
  game.setupFilters();
  game.setupDropTargets();
  game.setupClearCrafting();
  game.setupTakeSpinner();
  game.setupDialogs();

  game.getAutoSave().change(function()
  {
    game.autosave = $(this).is(':checked');
    if (game.autosave)
    {
      game.save();
      game.autoSaveId = setInterval(game.save, 10000);
    }
    else if (game.autoSaveId >= 0)
    {
      clearInterval(game.autoSaveId);
    }
  });
  
  game.autoSaveId = setInterval(game.save, 10000);
  
});

$(document).keypress(function(e)
{ 
  var tag = e.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea")
  {
    return;
  }

  e.preventDefault(); // Prevent page down on hitting space bar
  if (e.which == 71 || e.which == 103 && game.getGather().isVisible()) // '[Gg]'
  {
    game.gather();
  }
});

$(window).on('beforeunload', function()
{
  game.reclaimCraftingArea();
  if (game.autosave)
  {
    game.save();
  }
});

(function preloadImages()
{
  var images =
  [
    "shadows/Bottom",
    "shadows/BottomRight",
    "shadows/BottomRightCorner",
    "shadows/CraftingTable",
    "shadows/DepthShade",
    "shadows/Left",
    "shadows/Right",
    "shadows/Top",
    "shadows/TopLeft",
    "shadows/TopLeftCorner",
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