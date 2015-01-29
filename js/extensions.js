if (!Array.prototype.iterate)
{
    Array.prototype.iterate = function(f)
    {
        var length = this.length;
        for(var i = 0; i < length; i++)
        {
            f(this[i]);
        }
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
        })
    }
}