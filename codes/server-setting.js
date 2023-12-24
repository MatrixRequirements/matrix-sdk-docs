const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    const settings = await server.getServerSettings();
    let favorites = settings.settingList.filter((setting) => setting.key === "favorites");
    let favorite = {};
    if (favorites.length > 0) {
        console.log("Found existing favorites");
        favorite = JSON.parse(favorites[0].value);
    } else {
        favorite = {
            car: "Mustang",
            food: "Tacos",
            music: "Post-rock"
        };
        await server.putServerSetting("favorites", JSON.stringify(favorite));
        console.log("Saved favorites");
    }
    console.dir(favorite);
}

run().then(() => process.exit(0));
