var Class =
{
  // A simple function for defining simple classes
  // See JavaScript: The Definitive Guide
  // Java-Style Classes in JavaScript
  define: function(oArgs)
  {
    // A function that sets instance properties
    oArgs.ctor = oArgs.ctor || function() { };
    
    if (oArgs.methods)
    {
      // Instance methods: copied to prototype
      $.extend(oArgs.ctor.prototype, oArgs.methods);
    }
    
    if (oArgs.statics)
    {
      // Class properties: copied to constructor
      $.extend(oArgs.ctor, oArgs.statics);
    }
    
    return oArgs.ctor;
  }
}