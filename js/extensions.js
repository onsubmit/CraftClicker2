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

if (!jQuery.fn.clickEx)
{
  jQuery.fn.clickEx = function(data, handler)
  {
    if (!handler)
    {
      handler = data;
      data = undefined;
    }

    var $this = $(this);
    $this.on("click tap", data, handler);
    return $this;
  }
}

if (!jQuery.fn.dblclickEx)
{
  jQuery.fn.dblclickEx = function(data, handler)
  {
    if (!handler)
    {
      handler = data;
      data = undefined;
    }

    var $this = $(this);
    $this.on("dblclick doubletap", data, handler);
    return $this;
  }
}