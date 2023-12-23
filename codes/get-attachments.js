const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    let spec = await wheely.getItem("SPEC-2");
    let handler = spec.getFieldByName("Files")[0].getHandler();
    let fileData = JSON.parse(handler.getData());
    console.dir(fileData, { depth: null, colors: true });
}

run().then(() => process.exit(0));

