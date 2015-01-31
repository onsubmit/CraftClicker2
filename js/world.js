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
        arrRow[col].generate(0);
      }
    }
  })();
}

$.extend(World.prototype,
{
  drawTile: function(row, col)
  {
    var objTile = this.tiles[row][col];
    objTile.draw();
  },
  get: function()
  {
    return $("#grid");
  },
  getContainer: function()
  {
    return $("#gridContainer");
  },
  getCell: function(row, col)
  {
    return $("td[data-pos='" + row + "," + col + "']");
  },
  getHighlightedCell: function()
  {
    return $("td.highlight");
  },
  highlightCell: function(row, col)
  {
    this.getCell(row, col).addClass("highlight");
    return this;
  },
  unhighlightCell: function()
  {
    this.getHighlightedCell().removeClass("highlight");
    return this;
  },
  activateCoord: function(row, col)
  {
    this.getCell(row, col).addClass("active");
    return this;
  },
  deactivateCoord: function(row, col)
  {
    this.getCell(row, col).removeClass("active");
    return this;
  },
  toString: function()
  {
    return "";
  }
});