World = function(oArgs)
{
  var self = this;
  this.size = { rows: oArgs.rows, cols: oArgs.cols };
  this.tiles = (new Array(oArgs.rows)).assignEach(function() { return new Array(oArgs.cols); });

  (function generateWorld()
  {
    for (var row = 0, rows = self.tiles.length; row < rows; row++)
    {
      var arrRow = self.tiles[row];
      for (var col = 0, cols = arrRow.length; col < cols; col++)
      {
        arrRow[col] = new Tile();
        arrRow[col].generate(30);
      }
    }
  })();
}

$.extend(World.prototype,
{
  drawTile: function(row, col)
  {
    var objTile = this.tiles[row][col];
    this.getCell(row, col).append(objTile.generate());
  },
  getCell: function(row, col)
  {
    return $("td[data-pos='" + row + "," + col + "']");
  },
  toString: function()
  {
    return "";
  }
});