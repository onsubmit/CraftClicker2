Tile = function(oArgs)
{
  this.row = oArgs.row;
  this.col = oArgs.col;
  this.layers = [];
  this.digLevel = null;
}

$.extend(Tile.prototype, 
{
  getTable: function()
  {
    return $("table.tile[data-tpos='" + this.row + "," + this.col + "']");
  },
  getSquare: function(row, col, $table)
  {
    $table = $table || this.get();
    return $table.children("td[data-spos='" + row + "," + col + "']");
  },
  generate: function(level)
  {
    this.layers[level] = new Layer({ level: level });
    if (this.digLevel == null)
    {
      this.digLevel = level;
    }
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
        var visibleSquare = null;
        for (var level = this.digLevel, length = this.layers.length; level < length; level++)
        {
          var square = this.layers[level].squares[row][col];
          if (square)
          {
            visibleSquare = square;
            if (level < this.digLevel)
            {
              this.digLevel = level;
              activeSquare.row = row;
              activeSquare.col = col;
            }

            break;
          }
        }

        var $td = $("<td/>") .attr("data-spos", row + "," + col);
        if (level === 0 && visibleSquare == Items.get("Tree"))
        {
          $td
            .css("background", "url('images/Grass.png')")
            .append($("<img/>", { src: "images/Tree.png"}));
        }
        else
        {
          $td.css("background", "url('images/" + visibleSquare.name + ".png')");
        }

        $tr.append($td);
      }

      rowsToAdd.push($tr);
    }

    $table.append(rowsToAdd);
    this.getSquare(activeSquare.row, activeSquare.col, $table).addClass("active");
    return $table;
  },
  toString: function()
  {
    return "";
  }
});