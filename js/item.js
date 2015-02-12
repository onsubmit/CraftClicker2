Item = function(args)
{
  this.name = args.name;
  this.id = args.id;
  this.hardness = args.hardness || 1;
  this.hidden = !!args.hidden;
  this.recipe = args.recipe;
  this.gather = args.gather;
  this.image = args.image;
  this.pluralSuffix = args.pluralSuffix;
};

$.extend(Item.prototype,
{
  toString: function()
  {
    return this.name;
  }
});