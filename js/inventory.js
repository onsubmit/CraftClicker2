function Inventory(oArgs)
{
  this.items = {};
}

$.extend(Inventory.prototype,
{
  toString: function()
  {
    return "";
  }
});