const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let uc = wheely.createItem("UC");
    const title = "Test " + performance.now().toString();
    uc.setTitle(title);
    let handler = uc.getFieldByName("Description")[0].getHandler();
    handler.setHtml("We'll put an <b>image</b> here.");

    server.setComment("Creating attachment");
    uc = await wheely.putItem("F-UC-1", uc);
    console.log(`Created Item ${uc.getId()}`);
}

run().then(() => process.exit(0));

