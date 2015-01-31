World = function(oArgs)
{
  var self = this;
  this.size = { rows: oArgs.rows, cols: oArgs.cols };
  this.tiles = (new Array(oArgs.rows)).assignEach(function() { return new Array(oArgs.cols); });
}

$.extend(World.prototype,
{
  getTile: function(row, col)
  {
    var objTile = this.tiles[row][col];
    if (!objTile)
    {
      objTile = this.tiles[row][col] = new Tile({ row: row, col: col });
      objTile.generate(0);
    }

    return objTile;
  },
  getTiles: function()
  {
    return $("table.tile");
  },
  drawTile: function(row, col)
  {
    var isNew = !this.tiles[row][col];
    var objTile = this.getTile(row, col);

    var $table = null;
    if (isNew)
    {
      $table =  objTile.draw();
      this.getTileContainer().prepend($table);
    }
    else
    {
      $table = objTile.getTable();
    }

    return $table;
  },
  get: function()
  {
    return $("#world");
  },
  getContainer: function()
  {
    return $("#worldContainer");
  },
  getTileContainer: function()
  {
    return $("#tileContainer");
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