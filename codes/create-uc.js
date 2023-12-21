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

    const columnName = tableHandler.columnNumberToFieldId(0);
    tableHandler.setColumnData(2, columnName, "Throw milk away");

    server.setComment("Saving our first Item");
    uc = await wheely.putItem("F-UC-1", uc);
    console.log(`Created Item ${uc.getId()}`);
}

run().then(() => process.exit(0));

