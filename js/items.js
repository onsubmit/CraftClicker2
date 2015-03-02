Items = function() { }

$.extend(Items,
{
  _items: [],
  _nameMap: {},
  stackSize: 64,
  add: function(oArgs)
  {
    if (Items._nameMap[oArgs.name])
    {
      throw new Error("Item with name: " + oArgs.name + " already exists.");
    }
    
    var oItem = Items._nameMap[oArgs.name] = new Item(oArgs);
    Items._items.push(oItem);
  },
  get: function(idOrName)
  {
    if (Items._nameMap[idOrName])
    {
      return Items._nameMap[idOrName];
    }
    else if (Items._items[idOrName])
    {
      return Items._items[idOrName];
    }
    else
    {
      throw new Error("Cannot find item with identifier: " + idOrName);
    }
  },
  forEach: function(f)
  {
    this._items.forEach(f);
  },
  every: function(f)
  {
    this._items.every(f);
  },
  some: function(f)
  {
    this._items.some(f);
  }
});

Items.add(
{
  id: 0,
  name: "Grass",
  hardness: 1,
  gather: function()
  {
    return [{ item: Items.get("Grass") }].pushIf(r(0.25), { item: Items.get("Small Rock") });
  }
});

Items.add(
{
  id: 1,
  name: "Small Rock",
  pluralSuffix: "s"
});

Items.add(
{
  id: 2,
  name: "Tree",
  hidden: true,
  hardness: 4,
  gather: function()
  {
    var drops = [ { item: Items.get("Wood") } ]
                .pushIf(r(0.25), { item: Items.get("Sapling") })
                .pushIf(r(0.1), { item: Items.get("Stick") });

    return drops;
  }
});

Items.add(
{
  id: 3,
  name: "Sapling",
  pluralSuffix: "s"
});

Items.add(
{
  id: 4,
  name: "Wood",
  unlocks: [ "Lumber" ]
});

Items.add(
{
  id: 5,
  name: "Lumber",
  unlocks: [ "Stick", "Workbench" ],
  recipe: new Recipe(
  {
    makes: 4,
    ingredients:
    [
      [
        {
          item: Items.get("Wood"),
          amount: 1
        }
      ]
    ]
  })
});

Items.add(
{
  id: 6,
  name: "Stick",
  pluralSuffix: "s",
  unlocks: [ "Wood Plank" ],
  recipe: new Recipe(
  {
    makes: 2,
    ingredients:
    [
      [
        {
          item: Items.get("Lumber"),
          amount: 1
        }
      ],
      [
        {
          item: Items.get("Lumber"),
          amount: 1
        }
      ]
    ]
  })
});

Items.add(
{
  id: 7,
  name: "Wood Plank",
  pluralSuffix: "s",
  unlocks: [ "Workbench" ],
  recipe: new Recipe(
  {
    makes: 2,
    ingredients:
    [
      [
        {
          item: Items.get("Lumber"),
          amount: 1
        },
        {
          item: Items.get("Stick"),
          amount: 1
        }
      ],
      [
        {
          item: Items.get("Stick"),
          amount: 1
        },
        {
          item: Items.get("Lumber"),
          amount: 1
        }
      ]
    ]
  })
});

Items.add(
{
  id: 8,
  meta: 1,
  name: "Workbench",
  pluralSuffix: "es",
  unlocks: [ "Crafting Table" ],
  recipe: new Recipe(
  {
    ingredients:
    [
      [
        {
          item: Items.get("Lumber"),
          amount: 6
        }
      ]
    ]
  })
});

Items.add(
{
  id: 8,
  meta: 2,
  name: "Crafting Table",
  pluralSuffix: "s",
  recipe: new Recipe(
  {
    ingredients:
    [
      [
        {
          item: Items.get("Workbench"),
          amount: 2
        },
        {
          item: Items.get("Wood Plank"),
          amount: 1
        }
      ],
      [
        {
          item: Items.get("Wood Plank"),
          amount: 1
        },
        {
          item: Items.get("Workbench"),
          amount: 2
        }
      ]
    ]
  })
});

Items.add(
{
  id: 9,
  name: "Stone",
  hardness: 4
});

Items.add(
{
  id: 10,
  meta: 1,
  name: "Coal Ore",
  hardness: 6
});

Items.add(
{
  id: 10,
  meta: 2,
  name: "Iron Ore",
  hardness: 8
});

Items.add(
{
  id: 11,
  name: "Solidite",
  hardness: -1
});

Items.forEach(function(item)
{
  item.image = item.image || "images/" + item.name + ".png";
  item.pluralSuffix = item.pluralSuffix || "";

  if (item.recipe)
  {
    item.recipe.ingredients.forEach2d(function(ingredient)
    {
      item.recipe.level = Math.max(item.recipe.rows, item.recipe.cols);
      if (!ingredient.item.usedBy)
      {
        ingredient.item.usedBy = [ item.name ];
      }
      else if (!ingredient.item.usedBy.contains(item.name))
      {
        // Keep usedBy array sorted by item id
        var inserted = false;
        for (var i = 0, length = ingredient.item.usedBy.length; i < length; i++)
        {
          var usedByItemId = Items.get(ingredient.item.usedBy[i]).id;
          if (item.id < usedByItemId)
          {
            ingredient.item.usedBy.splice(i, 0, item.name);
            inserted = true;
            break;
          }
        }

        if (!inserted)
        {
          ingredient.item.usedBy.push(item.name);
        }
      }
    });
  }
});