var r = function(threshold)
{
  return Math.random() < threshold;
}

if (!Math.randomInt)
{
  Math.randomInt = function(min, max, bIsUpperBoundExclusive)
  {
    var multiplier = max - min + 1;
    if (bIsUpperBoundExclusive) multiplier--;
    return Math.floor(min + multiplier * Math.random());
  }
}

if (!String.prototype.trimStart)
{
  String.prototype.trimStart = function(c)
  {
    c = c || ' ';
    for (var i = 0, length = this.length; i < length && this.charAt(i) == c; i++) { /* empty */ }
    return this.substring(i);
  }
}

if (!String.prototype.trimEnd)
{
  String.prototype.trimEnd = function(c)
  {
    c = c || ' ';
    for (var i = this.length - 1; i >= 0 && this.charAt(i) == c; i--) { /* empty */ }
    return this.substr(0, i + 1);
  }
}

if (!Array.prototype.assignEach)
{
  Array.prototype.assignEach = function(f)
  {
    for(var i = 0, length = this.length; i < length; i++)
    {
      this[i] = f(i);
    }

    return this;
  }
}

if (!Array.prototype.pushIf)
{
  Array.prototype.pushIf = function(fCondition, item)
  {
    if (fCondition)
    {
      this.push(item);
    }

    return this;
  }
}

if (!Array.prototype.pushUnique)
{
  Array.prototype.pushUnique = function(item)
  {
    return this.pushIf($.inArray(item, this) === -1, item);
  }
}

if (!Array.prototype.forEach2d)
{
  Array.prototype.forEach2d = function(f)
  {
    for (var row = 0, rows = this.length; row < rows; row++)
    {
      for (var col = 0, cols = this[row].length; col < cols; col++)
      {
        var item = this[row][col];
        var retVal = f(item);
        if (typeof retVal !== "undefined")
        {
          return retVal;
        }
      }
    }
  }
}

if (!Array.prototype.some2d)
{
  Array.prototype.some2d = function(f)
  {
    for (var row = 0, rows = this.length; row < rows; row++)
    {
      for (var col = 0, cols = this[row].length; col < cols; col++)
      {
        var item = this[row][col];
        if (f(item))
        {
          return true;
        }
      }
    }

    return false;
  }
}

if (!Array.prototype.every2d)
{
  Array.prototype.every2d = function(f)
  {
    for (var row = 0, rows = this.length; row < rows; row++)
    {
      for (var col = 0, cols = this[row].length; col < cols; col++)
      {
        var item = this[row][col];
        if (!f(item))
        {
          return false;
        }
      }
    }

    return true;
  }
}

if (!jQuery.fn.fadeOutAndRemove)
{
  jQuery.fn.fadeOutAndRemove = function(duration, complete)
  {
    $(this).fadeOut(duration, function()
    {
      if (complete)
      {
        complete();
      }
      
      $(this).remove();
    });
  }
}

if (!jQuery.fn.disable)
{
  jQuery.fn.disable = function()
  {
    var $this = $(this);
    $this.prop('disabled', true);
    return $this;
  }
}

if (!jQuery.fn.enable)
{
  jQuery.fn.enable = function()
  {
    var $this = $(this);
    $this.prop('disabled', false);
    return $this;
  }
}

if (!jQuery.fn.isVisible)
{
  jQuery.fn.isVisible = function()
  {
    return $(this).is(':visible');
  }
}

if (!jQuery.fn.hasFocus)
{
  jQuery.fn.hasFocus = function()
  {
    return $(this).is(':focus');
  }
}