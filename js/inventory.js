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
      if (self.items[drop.item.id])
      {
        self.items[drop.item.id] += amount;
      }
      else
      {
        self.items[drop.item.id] = amount;
      }
    });
  },
  toString: function()
  {
    return "";
  }
});