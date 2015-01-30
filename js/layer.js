Layer = function(oArgs)
{
  var self = this;
  this.level = oArgs.level;
  this.squares = new Array(Layer._rows);

  (function generate()
  {
    for (var row = 0; row < Layer._rows; row++)
    {
      self.squares[row] = new Array(Layer._cols);
      for (var col = 0; col < Layer._cols; col++)
      {
        var objResource;
        for (var i = 0, length = Layer._oreProbabilities.length; i < length; i++)
        {
          var ore = Layer._oreProbabilities[i];
          if (self.level >= ore.minLevel && r(ore.probs(self.level)))
          {
            objResource = ore.item;
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
  _rows: 8,
  _cols: 8,
  _oreProbabilities:
  [
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
    }
  ]
});