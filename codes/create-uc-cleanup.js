const assert = require("assert");
const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let uc = wheely.createItem("UC");
    const title = "Test " + performance.now().toString();
    uc.setTitle(title);
    uc.getFieldByName("Description")[0].getHandler().setHtml("This is a test");
    let tableHandler = uc.getFieldByName("Use Case Steps")[0].getHandler();
    tableHandler.insertRow(0, ["Open fridge", "Fridge door opens"]);
    tableHandler.insertRow(1, ["Get milk", "Milk is in hand"]);
    tableHandler.insertRow(2, ["Drink milk", "Milk is gone"]);

    server.setComment("Saving our first Item");
    uc = await wheely.putItem("F-UC-1", uc);
    console.log(`Created Item ${uc.getId()}`);

    // We should get the tableHandler again, because we have a new uc object.
    const columnName = tableHandler.columnNumberToFieldId(0);
    tableHandler = uc.getFieldByName("Use Case Steps")[0].getHandler();
    tableHandler.setColumnData(2, columnName, "Throw milk away");
    uc = await wheely.updateItem(uc);
    console.log(`Updated Item ${uc.getId()}`);

    // Verify the change in the new object.
    tableHandler = uc.getFieldByName("Use Case Steps")[0].getHandler();
    assert(tableHandler.getColumnData(2, columnName) == "Throw milk away");

    await wheely.deleteItem(uc.getId());
    console.log(`Deleted Item ${uc.getId()}`);
}

run().then(() => process.exit(0));

