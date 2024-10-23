const lib = require("./lib.js");

function printLabels(item, msg) {
    const labels = item.getLabels();
    console.log(`${item.getId()}: ${msg}`);
    console.log(`  Labels: ${labels.join(", ")}`);
}

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    const tcs = await wheely.searchForItems("mrql:category=TC");
    const itemIndex = Math.floor(Math.random() * tcs.length);
    let tc = tcs[itemIndex];

    server.setComment("Changing labels");
    const oldLabels = [...tc.getLabels()];
    printLabels(tc, "Initial state");
    tc.setLabel("DAYTIME");
    printLabels(tc, "After set of DAYTIME (xor label)");
    tc.setLabel("NIGHTTIME");
    printLabels(tc, "After set of NIGHTTIME (xor label)");
    tc.setLabel("APPLE").setLabel("ORANGE");
    printLabels(tc, "After set of APPLE and ORANGE (or labels)");
    tc.unsetLabel("DAYTIME");
    printLabels(tc, "After unset of DAYTIME (should have no effect)");
    tc.setLabels([]);
    printLabels(tc, "Labels set to empty");
    if (tc.needsSave()) {
        console.log(`${tc.getId()} is dirty, not saving to the server`);
    }
 }

run().then(() => process.exit(0));

