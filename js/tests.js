var assertUniqueIds = function()
{
  console.log("Entering test: assertUniqueIds")
  var foundIds = [];
  var foundMetaIds = {};
  Items.forEach(function(item)
  {
    if (foundIds[item.id])
    {
      if (!item.meta)
      {
        throw new Error("Item with id " + item.id +  " already found.");
      }

      if (foundMetaIds[item.id])
      {
        if (foundMetaIds[item.id][item.meta])
        {
          throw new Error("Item with id " + item.id + " and meta " + item.meta + " already found.");
        }

        console.log("Found item with id " + item.id + " and meta " + item.meta);
        foundMetaIds[item.id].push(item.meta);
      }
      else
      {
        foundMetaIds[item.id] = [item.meta];
      }
    }
    else
    {
      foundIds.push(item.id);
      if (item.meta)
      {
        console.log("Found item with id " + item.id + " and meta " + item.meta);
        foundMetaIds[item.id] = [item.meta];
      }
      else
      {
        console.log("Found item with id " + item.id);
      }
    }
  });
};

if (getParameterByName("test") === "1")
{
  assertUniqueIds();
}