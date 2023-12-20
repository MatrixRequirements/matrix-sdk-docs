const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");
    const wheelyConfig = wheely.getItemConfig();
    const data = wheelyConfig.getCategories().map((c) => { 
      return { cat: c, downLinks: wheelyConfig.getItemConfiguration(c).downLinksRequired }; })
      .filter((o) => o.downLinks.length > 0)
      .map((o) => `  ${o.cat} -> ${o.downLinks.join(",")}`);
    console.log(`digraph {\n${data.join('\n')}\n rankdir="LR";\n}`);
}

run().then(() => process.exit(0));

