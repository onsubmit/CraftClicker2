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
  getAllShadowedSquares: function()
  {
    return this.getTable().find(".shadowAll");
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
    if (arrDrops) // Null if square is still in the process of breaking
    {
      var objSquare = objLayer.squares[this.activeSquare.row][this.activeSquare.col];
      if (objSquare.clusterSize === 0)
      {
        // The cluster has been fully mined.
        // Advance the active square.
        objLayer.squares[this.activeSquare.row][this.activeSquare.col] = undefined;
        this.redrawSquare(this.activeSquare.row, this.activeSquare.col);
        var wasReversed = this.advanceActiveRow();
        if (wasReversed)
        {
          this.getAllShadowedSquares().removeClass("shadowAll");
          this.digLevel++;
        }
        else
        {
          this.deactivateSquare();
        }
        
        this.activateSquare(this.activeSquare.row, this.activeSquare.col);
      }
      else
      {
        objSquare.hardness = Items.get(objSquare.item.name).hardness;
        this.getSquare(this.activeSquare.row, this.activeSquare.col).find(".layer").text(objSquare.clusterSize);
      }
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
    var $table = this.getTable();
    var strImagePath = square.item.image || "images/" + square.item.name + ".png";
    var $td = $("<td/>") .attr("data-spos", row + "," + col)
      .attr("title", square.item.name)
      .css("background", "url('" + strImagePath + "')");

    if (square.clusterSize > 1)
    {
      $td.append($("<div/>",
      {
        text: square.clusterSize,
        class: "layer"
      }));
    }

    if (isDeep)
    {
      var strShadowClass = null;
      var fIsFirstRow = row === 0;
      var fIsFirstCol = col === 0;
      var fIsLastRow  = row === Layer.rows - 1;
      var fIsLastCol  = col === Layer.cols - 1;
      if (this._reverse)
      {
        if (fIsFirstCol && !fIsFirstRow)
        {
          strShadowClass = "shadowTop";
        }
        else if (!fIsFirstRow)
        {
          strShadowClass = "shadowTopLeft";
        }
        else
        {
          $table.find(".shadowLeft").toggleClass("shadowLeft shadowAll");
          if (!fIsFirstCol)
          {
            strShadowClass = "shadowLeft";
          }
        }            

        $table.find(".shadowTopLeft").toggleClass("shadowTopLeft shadowTop");
        if (!fIsLastRow)
        {
          $table.find(".shadowTopLeftCorner").toggleClass("shadowTopLeftCorner shadowAll");
          var $shadowTop = this.getSquare(row + 1, col, $table).find(".shadowTop");
          $shadowTop.toggleClass("shadowTop " + (fIsFirstCol ? "shadowAll" : "shadowTopLeftCorner"));
        }
      }
      else
      {
        if (fIsLastCol && !fIsLastRow)
        {
          strShadowClass = "shadowBottom";
        }
        else if (!fIsLastRow)
        {
          strShadowClass = "shadowBottomRight";
        }
        else
        {
          $table.find(".shadowRight").toggleClass("shadowRight shadowAll");
          if (!fIsLastCol)
          {
            strShadowClass = "shadowRight";
          }
        }            

        $table.find(".shadowBottomRight").toggleClass("shadowBottomRight shadowBottom");
        if (!fIsFirstRow)
        {
          $table.find(".shadowBottomRightCorner").toggleClass("shadowBottomRightCorner shadowAll");
          var $shadowBottom = this.getSquare(row - 1, col, $table).find(".shadowBottom");
          $shadowBottom.toggleClass("shadowBottom " + (fIsLastCol ? "shadowAll" : "shadowBottomRightCorner"));
        }
      }

      if (strShadowClass)
      {
        var $firstLayer = $td.find(">:first-child");
        if ($firstLayer.length)
        {
          $firstLayer.addClass(strShadowClass);
        }
        else
        {
          var $newLayer = $("<div/>", { class: "layer " + strShadowClass});
          $td.append($newLayer);
        }
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
        if (!this.layers[level])
        {
          this.layers[level] = new Layer({ level: level });
        }
        
        square = this.layers[level].squares[row][col];
      }
      else
      {
        return null;
      }
    }

    return this.drawSquare(row, col, level, square, isDeep);
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