Layer = function(oArgs)
{
  var self = this;

  this._isMined = false;
  this.level = oArgs.level;
  this.squares = new Array(Layer.rows);

  (function generate()
  {
    for (var row = 0; row < Layer.rows; row++)
    {
      self.squares[row] = new Array(Layer.cols);
      for (var col = 0; col < Layer.cols; col++)
      {
        var objResource = null;
        for (var i = 0, length = Layer._probabilities.length; i < length; i++)
        {
          var square = Layer._probabilities[i];
          var minLevel = square.minLevel === 0 ? 0 : square.minLevel || 1;
          var maxLevel = square.maxLevel === 0 ? 0 : square.maxLevel || Layer._maxLayers;
          if (self.level < minLevel || self.level > maxLevel)
          {
            continue;
          }

          if (r(square.probs(self.level)))
          {
            objResource = square.item;
            break;
          }
          else if (square.fallback)
          {
            objResource = square.fallback;
            break;
          }
        }

        self.squares[row][col] = objResource || Items.get("Stone");
      }
    }
  })();
};

$.extend(Layer.prototype,
{
  toString: function()
  {
    return "";
  }
});

$.extend(Layer,
{
  rows: 8,
  cols: 8,
  _maxLayers: 128,
  _probabilities:
  [
    {
      item: Items.get("Grass"),
      minLevel: 0,
      maxLevel: 0,
      fallback: Items.get("Tree"),
      probs: function(level)
      {
        return level === 0 ? 0.9 : 0;
      }
    },
    {
      item: Items.get("Coal Ore"),
      minLevel: 1,
      probs: function(level)
      {
        if (level <= 10)
        {
          // https://www.wolframalpha.com/share/clip?f=d41d8cd98f00b204e9800998ecf8427eppd8m24ru8
          return 0.008 * level;
        }
        else if (level <= 64)
        {
          return 0.08;
        }
        else
        {
          // https://www.wolframalpha.com/share/clip?f=d41d8cd98f00b204e9800998ecf8427ehrb1vq9f0j
          return 0.08 * (1 - Math.pow(level - 64, 1/3) / 4);
        }
      }
    },
    {
      item: Items.get("Iron Ore"),
      minLevel: 1,
      probs: function(level)
      {
        if (level <= 10)
        {
          return 0.006 * level;
        }
        else if (level <= 64)
        {
          return 0.06;
        }
        else
        {
          return 0.06 * (1 - Math.pow(level - 64, 1/3) / 4);
        }
      }
    },
    {
      item: Items.get("Solidite"),
      minLevel: Layer._maxLayers,
      maxLevel: Layer._maxLayers,
      probs: function(level)
      {
        return level === Layers._maxLayers ? 1 : 0;
      }
    },
  ]
});