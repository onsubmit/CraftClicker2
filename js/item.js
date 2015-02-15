Item = function(args)
{
  var wasCloneProvided = !!args.clone;

  args.clone = args.clone || {};
  this.name = args.clone.name || args.name;
  this.id = args.clone.id || args.id;
  this.meta = args.clone.meta || args.meta;
  this.hardness = args.clone.hardness || args.hardness || 1;
  this.hidden = typeof args.clone.hidden !== 'undefined' ? !!args.clone.hidden : !!args.hidden;
  this.recipe = args.clone.recipe || args.recipe;
  this.gather = wasCloneProvided ? (args.clone.gather || Items.get(this.name).gather) : args.gather;
  this.onCraft = wasCloneProvided ? (args.clone.onCraft || Items.get(this.name).onCraft) : args.onCraft;
  this.image = args.clone.image || args.image;
  this.pluralSuffix = args.clone.pluralSuffix || args.pluralSuffix;
};

$.extend(Item.prototype,
{
  toString: function()
  {
    return this.name;
  }
});