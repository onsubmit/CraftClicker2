Tile = function(oArgs)
{
  this._reverse = false;
  this.row = oArgs.row;
  this.col = oArgs.col;
  this.layers = [];
  this.digLevel = null;
  this.activeSquare = { row: 0, col: 0 };
}

$.extend(Tile.prototype, 
{
  getTable: function()
  {
    return $("table.tile[data-tpos='" + this.row + "," + this.col + "']");
  },
  getSquare: function(row, col, $table)
  {
    $table = $table || this.getTable();
    return $table.find("td[data-spos='" + row + "," + col + "']");
  },
  getAllSquares: function()
  {
    return this.getTable().find("td");
  },
  getAllDeepLayers: function()
  {
    return this.getTable().find(".deep");
  },
  getActiveSquare: function(row, col)
  {
    return this.getTable().find("td.active");
  },
  deactivateSquare: function()
  {
    this.getActiveSquare().removeClass("active");
    return this;
  },
  activateSquare: function(row, col, $table)
  {
    this.getSquare(row, col, $table).addClass("active");
    return this;
  },
  generate: function(level)
  {
    this.layers[level] = new Layer({ level: level });
    if (this.digLevel == null)
    {
      this.digLevel = level;
    }
  },
  gather: function()
  {
    var objLayer = this.layers[this.digLevel];
    var arrDrops = objLayer.gather(this.activeSquare.row, this.activeSquare.col);
    var objSquare = objLayer.squares[this.activeSquare.row][this.activeSquare.col];
    if (objSquare.durability === 0)
    {
      // The square has been fully looted
      objLayer.squares[this.activeSquare.row][this.activeSquare.col] = undefined;
      this.redrawSquare(this.activeSquare.row, this.activeSquare.col);
      var wasReversed = this.advanceActiveRow();
      if (wasReversed)
      {
        this.getAllSquares().removeClass();
        this.getAllDeepLayers().remove();
        this.digLevel++;
      }
      else
      {
        this.deactivateSquare();
      }
      
      this.activateSquare(this.activeSquare.row, this.activeSquare.col);
    }

    return arrDrops;
  },
  advanceActiveRow: function()
  {
    if (this._reverse)
    {
      if (this.activeSquare.col > 0)
      {
        this.activeSquare.col--;
      }
      else if (this.activeSquare.row > 0)
      {
        this.activeSquare.row--;
        this.activeSquare.col = Layer.cols - 1;
      }
      else
      {
        this._reverse = false;
        return true;
      }
    }
    else
    {
      if (this.activeSquare.col < Layer.cols - 1)
      {
        this.activeSquare.col++;
      }
      else if (this.activeSquare.row < Layer.rows - 1)
      {
        this.activeSquare.row++;
        this.activeSquare.col = 0;
      }
      else
      {
        this._reverse = true;
        return true;
      }
    }

    return false;
  },
  drawSquare: function(row, col, level, square, isDeep)
  {
    var $td = $("<td/>") .attr("data-spos", row + "," + col);
    if (level === 0 && square == Items.get("Tree"))
    {
      $td
        .css("background", "url('images/Grass.png')")
        .append($("<img/>", { src: "images/Tree.png"}));
    }
    else
    {
      $td.css("background", "url('images/" + square.name + ".png')");
      if (isDeep)
      {
        var strDeepClass = null;
        if (row === 0)
        {
          if (col === 0)
          {
            strDeepClass = "shadowTopLeft";
          }
          else if (col === Layer.cols - 1)
          {
            strDeepClass = "shadowTopRight";
          }
          else
          {
            strDeepClass = "shadowTop";
          }
        }
        else if (col === 0)
        {
          if (row === Layer.rows - 1)
          {
            strDeepClass = "shadowBottomLeft";
          }
          else
          {
            strDeepClass = "shadowLeft";
          }
        }
        else if (row === Layer.rows - 1)
        {
          if (col === Layer.cols - 1)
          {
            strDeepClass = "shadowBottomRight";
          }
          else
          {
            strDeepClass = "shadowBottom";
          }
        }
        else if (col === Layer.cols - 1)
        {
          strDeepClass = "shadowRight";
        }

        $td.addClass(strDeepClass).append($("<div/>", { class: "deep" }));
      }
    }

    return $td;
  },
  redrawSquare: function(row, col)
  {
    var $square = this.getSquare(row, col);
    var $contents = this.drawFirstVisibleSquare(row, col);
    if ($contents)
    {
      $square.replaceWith($contents);
    }
  },
  drawFirstVisibleSquare: function(row, col)
  {
    var isDeep = false;
    var level = this.digLevel;
    var square = this.layers[level].squares[row][col];
    if (!square)
    {
      if (++level < Layer._maxLayers)
      {
        isDeep = true;
        this.layers[level] = new Layer({ level: level });
        square = this.layers[level].squares[row][col];
      }
      else
      {
        return null;
      }
    }

    return this.drawSquare(row, col, level, square.item, isDeep);
  },
  draw: function()
  {
    var $table = $("<table/>",
    {
      class: "tile"
    }).attr("data-tpos", this.row + "," + this.col);

    var rowsToAdd = [];
    var activeSquare = {row: 0, col: 0};
    for (var row = 0; row < Layer.rows; row++)
    {
      var $tr = $("<tr/>");
      for (var col = 0; col < Layer.cols; col++)
      {
        var $td = this.drawFirstVisibleSquare(row, col);
        $tr.append($td);
      }

      rowsToAdd.push($tr);
    }

    $table.append(rowsToAdd);
    this.activateSquare(0, 0, $table);
    return $table;
  },
  toString: function()
  {
    return "";
  }
});