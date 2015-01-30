Player = function(oArgs)
{
  this.level = 0;
  this.maxLevel = 2;
  this.xp   = 0;
  this.xpMax = 20;
  this.vector = { row: 1, col: 1};
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
  collect: function(drops) {
    for (var prop in drops) {
      var drop = drops[prop];
      var unmerged = this.inventory.mergeItem(drop.item, drop.amount);
      if (unmerged > 0) {
        this.sellItem(drop.item, unmerged);
      }
    }
  },
  toString: function()
  {
    return "";
  }
});