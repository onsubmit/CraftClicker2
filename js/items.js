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
  name: "Wood"
});

Items.add(
{
  id: 5,
  name: "Lumber",
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
          item: Items.get("Lumber"),
          amount: 1
        }
      ],
      [
        {
          item: Items.get("Lumber"),
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
  name: "Workbench",
  pluralSuffix: "es",
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
});