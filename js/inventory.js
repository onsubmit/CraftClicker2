function Inventory(args)
{
  args = args || {};
  args.clone = args.clone || {};
  this.items =  args.clone.items || {};

  $.extend(Inventory.prototype,
  {
    merge: function(arrDrops)
    {
      var self = this;
      arrDrops.forEach(function(drop)
      {
        var amount = drop.amount || 1;
        self.mergeById(drop.item.id, amount);
      });
    },
    mergeById: function(id, amount)
    {
      if (this.items[id])
      {
        this.items[id] += amount;
      }
      else
      {
        this.items[id] = amount;
      }
    },
    consume: function(item, amount)
    {
      this.items[item.id] -= amount;
    },
    toString: function()
    {
      for (var id in this.items)
      {
        var item = Items.get(id);
        console.log(item.name + ": " + this.items[id]);
      }
    }
  });
}