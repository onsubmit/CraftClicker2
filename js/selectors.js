$.extend(Game.prototype,
{
  getPlayer: function()
  {
    return $("#player");
  },
  getOptions: function()
  {
    return $("#options");
  },
  getSave: function()
  {
    return $("#save");
  },
  getAutoSave: function()
  {
    return $("#autosave");
  },
  getLoad: function()
  {
    return $("#load");
  },
  getExport: function()
  {
    return $("#export");
  },
  getImport: function()
  {
    return $("#import");
  },
  getReset: function()
  {
    return $("#reset");
  },
  getZoomIn: function()
  {
    return $("#zoomIn");
  },
  getZoomOut: function()
  {
    return $("#zoomOut");
  },
  getGather: function()
  {
    return $("#gather");
  },
  getWorld: function()
  {
    return $("#world");
  },
  getWorldContainer: function()
  {
    return $("#worldContainer");
  },
  getCraftingContainer: function()
  {
    return $("#craftingContainer");
  },
  getCraftingTable: function()
  {
    return $("#craftingTable");
  },
  getCellsFromCraftingTable: function()
  {
    return $(".crafting.dropped");
  },
  getCellFromCraftingTable: function(row, col)
  {
    return $("#craftingTable td[data-cpos='" + row + "," + col + "']");
  },
  getItemInOutput: function()
  {
    return $(".crafted");
  },
  getCraftingAction: function()
  {
    return $("#craftingAction");
  },
  getCraftingOutput: function()
  {
    return $("#craftingOutput");
  },
  getInventoryContainer: function()
  {
    return $("#inventoryContainer");
  },
  getLeftColumn: function()
  {
    return $("#leftColumn");
  },
  getInventoryFilter: function()
  {
    return $("#inventoryFilter");
  },
  getIsInventoryMoveStacksChecked: function()
  {
    return $("#inventoryMoveStacks").is(":checked");
  },
  getInventoryList: function()
  {
    return $("#inventoryList");
  },
  getInventoryItem: function(itemId)
  {
    return $("#inv" + itemId);
  },
  getInventoryAmount: function(itemId)
  {
    return $("#inva" + itemId);
  },
  getInventoryIcon: function(itemId)
  {
    return $("#invi" + itemId);
  },
  getItemFilter: function()
  {
    return $("#itemFilter");
  },
  getItemList: function()
  {
    return $("#itemList");
  },
  getItemTooltip: function()
  {
    return $("#itemTooltip");
  },
  getItemTooltipIcon: function()
  {
    return $("#itemTooltipIcon");
  },
  getItemTooltipName: function()
  {
    return $("#itemTooltipName");
  },
  getItemMenu: function()
  {
    return $("#itemMenu");
  },
  getItemMenuRecipe: function()
  {
    return $("#itemMenuRecipe");
  },
  getItemMenuUses: function()
  {
    return $("#itemMenuUses");
  },
  getClearCraft: function()
  {
    return $("#clearCraft");
  },
  getCraftingTakeContainer: function()
  {
    return $("#craftingTakeContainer");
  },
  getCraftingTakeAmount: function()
  {
    return $("#craftingTakeAmount");
  },
  getExportDialog: function()
  {
    return $("#exportDialog");
  },
  getExportData: function()
  {
    return $("#exportData");
  },
  getImportDialog: function()
  {
    return $("#importDialog");
  },
  getImportData: function()
  {
    return $("#importData");
  },
  getOptionsDialog: function()
  {
    return $("#optionsDialog");
  },
  getCraftingDialog: function()
  {
    return $("#craftingDialog");
  },
  clearCraftingTable: function()
  {
    this.getCellsFromCraftingTable().remove();
  },
  getCraftingDialogAction: function()
  {
    return $("#craftingDialogAction");
  },
  getCraftingDialogOutputTable: function()
  {
    return $("#craftingDialogOutputTable");
  },
  getCraftingDialogOutput: function()
  {
    return $("#craftingDialogOutput");
  },
  getCraftingDialogUseIndex: function()
  {
    return $("#craftingDialogUseIndex");
  },
  getCraftingDialogUses: function()
  {
    return $("#craftingDialogUses");
  },
  clearCraftingOutput: function()
  {
    return this.getCraftingOutput().empty();
  },
  getCraftingDialogTable: function()
  {
    return $("#craftingDialogTable");
  },
});