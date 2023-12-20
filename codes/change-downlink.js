const assert = require("assert");
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");
    server.setComment("Changing for a test");
    const mask = wheely.constructSearchFieldMask({ includeDownlinks: true });
    const query = "mrql:category=SPEC and downLink=TC";
    const specsWithTCs = await wheely.searchForItems(query, "", false, mask);
    const itemIndex = Math.floor(Math.random() * specsWithTCs.length);
    let spec = specsWithTCs[itemIndex];
    console.log(
        `Found ${specsWithTCs.length} SPEC Items that have TC downlinks. Choosing ${spec.getId()} at random.`);

    const oldDownlinks = [...spec.getDownlinks()];  // Ensure we copy the array, as we need it later.
    assert(oldDownlinks.length > 0);
    console.log(`${spec.getId()} linked to ${oldDownlinks[0].to}`);
    spec.removeDownlink(oldDownlinks[0].to);

    spec = await wheely.updateItem(spec);

    console.log(`Item updated...re-running search query..`);
    const query2 = await wheely.searchForItems(query, "", false, mask);
    // Ensure spec is not present.
    assert(query2.filter((item) => item.getId() == spec.getId()).length == 0);

    // set things right again.
    spec.addDownlink(oldDownlinks[0].to);
    spec = await wheely.updateItem(spec);

    const query3 = await wheely.searchForItems(query, "", false, mask);
    // Ensure spec is present.
    assert(query3.filter((item) => item.getId() == spec.getId()).length == 1);
    console.log(`Success changing and restoring ${spec.getId()}.`);
 }

run().then(() => process.exit(0));

