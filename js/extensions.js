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

if (!Array.prototype.assignEach)
{
  Array.prototype.assignEach = function(f)
  {
    var length = this.length;
    for(var i = 0; i < length; i++)
    {
      this[i] = f();
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