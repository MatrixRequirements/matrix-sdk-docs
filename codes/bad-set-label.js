const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    const reqs = await wheely.searchForItems("mrql:category=REQ");
    const itemIndex = Math.floor(Math.random() * reqs.length);
    let req = reqs[itemIndex];

    req.setLabel("DAYTIME");
 }

run().then(() => process.exit(0));

