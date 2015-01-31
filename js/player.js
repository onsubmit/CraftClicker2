Player = function(oArgs)
{
  this.level = 0;
  this.maxLevel = 2;
  this.xp   = 0;
  this.xpMax = 20;
  this.vector = { row: 1, col: 1};
  this.tile = { row: 0, col: 0};
  this.speed = 200; // Number of milliseconds it takes to move one square
  
  this.inventory = new Inventory();
}

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
  gather: function()
  {
    
  },
  toString: function()
  {
    return "";
  }
});