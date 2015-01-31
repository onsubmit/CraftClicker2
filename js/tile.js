Tile = function(oArgs)
{
  this.layers = [];
  this.digLevel = null;
}

$.extend(Tile.prototype, 
{
  get: function() {
    return $("#tile");
  },
  getSquare: function(row, col)
  {
    return $("td[data-lpos='" + row + "," + col + "']");
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

        var $td = $("<td/>")
          .attr("data-lpos", row + "," + col)
          .css("background", "url('images/" + visibleSquare.name + ".png')");
        $tr.append($td);
      }

      rowsToAdd.push($tr);
    }

    this.get().append(rowsToAdd);
    this.getSquare(activeSquare.row, activeSquare.col).addClass("active");
  },
  toString: function()
  {
    return "";
  }
});