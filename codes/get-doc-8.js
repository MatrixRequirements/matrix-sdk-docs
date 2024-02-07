const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let doc = await wheely.getItemAsDoc("DOC-8");
    const handlers = doc.getInnerDHFFields();
    console.log(`Fields in DOC-8:`);
    for (let handler of handlers) {
        console.log(`"${handler.getFieldName()}" [${handler.getFieldType()}]`);
    }
}

run().then(() => process.exit(0));
