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