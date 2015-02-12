World = function(args)
{
  var self = this;
  args = args || {};
  args.clone = args.clone || {};
  this.size = args.clone.size || { rows: args.rows, cols: args.cols };
  this.tiles = (new Array(this.size.rows)).assignEach(function() { return new Array(self.size.cols); });

  if (args.clone.tiles)
  {
    args.clone.tiles.forEach2d(function(tile, row, col)
    {
       self.tiles[row][col] = tile ? new Tile({ clone: tile }) : null;
    });
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
      var objTile = this.getTile(row, col);
      var isNew = !this.tiles[row][col] || !this.getTiles().length || !objTile.getTable().length;

      var $table = null;
      if (isNew)
      {
        $table = objTile.draw();
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

}