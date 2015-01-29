var Recipe = Class.define(
{
  ctor: function(oArgs)
  {
    this.ingredients = oArgs.ingredients; // Can be undefined
    this.makes = oArgs.makes || 1;
  }
});