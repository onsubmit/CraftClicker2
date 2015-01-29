var Item = Class.define(
{
  ctor: function(oArgs)
  {
    this.name = oArgs.name;
    this.id = oArgs.id;
    this.recipe = oArgs.recipe;
  },
  methods:
  {
    toString: function()
    {
      return this.name;
    }
  }
});