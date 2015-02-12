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
    consume: function(arrIngredients)
    {
      // WARNING! This method does ABSOLUTELY NO bounds checking on the ingredients (on purpose).
      // WARNING! The UI should prevent the player from consuming items they don't actually have.
      var self = this;
      arrIngredients.forEach2d(function(ingredient)
      {
        if (ingredient)
        {
          var amount = ingredient.amount || 1;
          self.items[ingredient.item.id] -= amount
        }
      });
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