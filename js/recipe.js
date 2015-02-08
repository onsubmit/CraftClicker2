Recipe = function(oArgs)
{
  this.ingredients = oArgs.ingredients; // Can be undefined
  this.makes = oArgs.makes || 1;
  this.isShaped = typeof oArgs.isShaped === "undefined" ? true : oArgs.isShaped
  if (this.ingredients)
  {
    this.rows = this.ingredients.length;
    this.cols = this.ingredients[0].length;
  }
}

$.extend(Recipe.prototype,
{
  check: function(arrIngredients)
  {
    var self = this;
    if (!this.ingredients)
    {
      return false;
    }

    var minCraftableAmount = -1;
    var determineMinCraftableAmount = function(haveAmount, needAmount)
    {
      var dividend = Math.floor(haveAmount / needAmount);
      if (minCraftableAmount == -1)
      {
        minCraftableAmount = dividend;
      }
      else
      {
        minCraftableAmount = Math.min(minCraftableAmount, dividend);
      }
    };
      
    if (this.isShaped)
    {
      // TODO: Support crafting smaller recipes in larger crafting tables.
      //       Example: A 2x2 recipe should be craftable in 4 different ways
      //       This should be accomplishable by "trimming" arrIngredients down to its non empty cells
      for (var row = 0, rows = arrIngredients.length; row < rows; row++)
      {
        for (var col = 0, cols = arrIngredients[row].length; col < cols; col++)
        {
          var ingredient = arrIngredients[row][col];
          if (ingredient)
          {
            if (row >= self.rows ||
                col >= self.cols ||
                !arrIngredients[row][col] ||
                ingredient.amount < this.ingredients[row][col].amount ||
                ingredient.item != this.ingredients[row][col].item)
            {
              // An incorrect ingredient was supplied.
              return 0;
            }
            else
            {
              determineMinCraftableAmount(ingredient.amount, this.ingredients[row][col].amount);
            }
          }
          else if (row < self.rows && col < self.cols && this.ingredients[row][col])
          {
            // An ingredient is missing.
            return 0;
          }
          else
          {
            determineMinCraftableAmount(ingredient.amount, this.ingredients[row][col].amount);
          }
        }
      }
    }
    else
    {
      // Not implemented yet
      return 0;
    }

    return minCraftableAmount;
  }
});