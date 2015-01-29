var Player = Class.define(
{
  ctor: function(oArgs)
  {
    this.level = 0;
    this.maxLevel = 2;
    this.xp   = 0;
    this.xpMax = 20;
    this.speed = 200; // Number of milliseconds it takes to move one square
    
    this.inventory = new Inventory();
  },
  methods:
  {
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
  }
});