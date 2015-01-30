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