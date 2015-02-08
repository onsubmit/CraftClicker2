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
    
    oArgs.id = Items._items.length;
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
  name: "Grass",
  hardness: 1
});

Items.add(
{
  name: "Tree",
  hidden: true,
  hardness: 4,
  gather: function()
  {
    return [{ item: Items.get("Wood") }].pushIf(r(0.25), { item: Items.get("Sapling") });
  }
});

Items.add(
{
  name: "Sapling",
  pluralSuffix: "s"
});

Items.add({ name: "Wood" });

Items.add(
{
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
  name: "Stick",
  pluralSuffix: "s",
  recipe: new Recipe(
  {
    makes: 2,
    isShaped: false,
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
      ]
    ]
  })
});

Items.add(
{
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
  name: "Stone",
  hardness: 4
});

Items.add(
{
  name: "Coal Ore",
  hardness: 6
});

Items.add(
{
  name: "Iron Ore",
  hardness: 8
});

Items.add(
{
  name: "Solidite",
  hardness: -1
});

Items.forEach(function(item)
{
  item.image = item.image || "images/" + item.name + ".png";
  item.pluralSuffix = item.pluralSuffix || "";
});