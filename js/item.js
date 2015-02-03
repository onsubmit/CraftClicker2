Item = function(oArgs)
{
  this.name = oArgs.name;
  this.id = oArgs.id;
  this.hardness = oArgs.hardness || 1;
  this.hidden = !!oArgs.hidden;
  this.recipe = oArgs.recipe;
  this.gather = oArgs.gather;
  this.image = oArgs.image;
};

$.extend(Item.prototype,
{
  toString: function()
  {
    return this.name;
  }
});