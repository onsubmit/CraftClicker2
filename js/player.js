Player = function(args)
{
  args = args || {};
  args.clone = args.clone || {};
  this.level = args.clone.level || 0;
  this.maxLevel = args.clone.maxLevel || 2;
  this.xp = args.clone.xp || 0;
  this.xpMax = args.clone.xpMax || 20;
  this.vector = args.clone.vector || { row: 0, col: 0 };
  this.tile = args.clone.tile || { row: 0, col: 0 };
  this.speed = args.clone.speed || 200; // Number of milliseconds it takes to move one square
  
  this.inventory = new Inventory({ clone: args.clone.inventory });

  $.extend(Player.prototype,
  {
    setPosition: function(row, col)
    {
      this.vector.row = row;
      this.vector.col = col;
    },
    setDestination: function(row, col)
    {
      this.vector.destRow = row;
      this.vector.destCol = col;
    },
    levelUp: function()
    {
      this.level++;
      this.xp = this.xp - this.xpMax;
      this.xpMax = this.xpMax + this.level * 2;
    },
    toString: function()
    {
      return "";
    }
  });
}