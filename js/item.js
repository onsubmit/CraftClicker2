Item = function(oArgs)
{
  this.name = oArgs.name;
  this.id = oArgs.id;
  this.recipe = oArgs.recipe;
};

$.extend(Item.prototype,
{
  toString: function()
  {
    return this.name;
  }
});