const lib = require("./lib.js");

function print(data) {
    try {
        console.dir(JSON.parse(data));
    } catch(e) {
        console.log(data);
    }
}

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let doc = await wheely.getItemAsDoc("DOC-8");
    const handlers = doc.getInnerDHFFields();
    console.log(`Fields in DOC-8:`);
    for (let handler of handlers) {
        console.log(`"${handler.getFieldName()}" [${handler.getFieldType()}]`);
        console.group()
        console.dir(handler.dhfFieldConfig);
        // Print the value of the field:
        print(handler.getData());
        console.groupEnd();
    }
}

run().then(() => process.exit(0));
