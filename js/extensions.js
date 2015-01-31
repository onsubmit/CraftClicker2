var r = function(threshold)
{
  return Math.random() < threshold;
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

if (!jQuery.fn.tap)
{
  jQuery.fn.tap = function(eventData, handler)
  {
    var $this = $(this);
    $this.hammer().bind("tap", eventData, handler);
    return $this;
  }
}

if (!jQuery.fn.doubletap)
{
  jQuery.fn.doubletap = function(eventData, handler)
  {
    var $this = $(this);
    $this.hammer().bind("doubletap", eventData, handler);
    return $this;
  }
}