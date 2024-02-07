const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let doc = await wheely.getItemAsDoc("DOC-8");
    const urlToPDF = await doc.toPDF((jid, details) => {
        console.log(`${details.status} ${details.progress}`);
        console.dir(details.jobFile);
    });
    console.log(urlToPDF);
}

run().then(() => process.exit(0));
