function Inventory(oArgs)
{
  this.items = {};
}

$.extend(Inventory.prototype,
{
  merge: function(arrDrops)
  {
    var self = this;
    arrDrops.forEach(function(drop)
    {
      var amount = drop.amount || 1;
      if (self.items[drop.item.name])
      {
        self.items[drop.item.name] += amount;
      }
      else
      {
        self.items[drop.item.name] = amount;
      }
    });
  },
  toString: function()
  {
    return "";
  }
});