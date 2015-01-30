Tile = function(oArgs)
{
  this.layers = [];
}

$.extend(Tile.prototype, 
{
  generate: function(level)
  {
    this.layers[level] = new Layer({ level: level });
  },
  toString: function()
  {
    return "";
  }
});

$.extend(Tile,
{
  _maxLayers: 128
});