const fs = require("fs");
const lib = require("./lib.js");
const axios = require("axios");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    server.setComment("Creating attachment");

    const filePath = __dirname + "/resources/typewriter.jpg";
    let file = fs.createReadStream(filePath);
    let result = await wheely.uploadLocalFile(axios, file, (p) => {
        console.log("Uploading...");
    });

    // Convert the result to a url
    const url = wheely.computeFileUrl(result);
    console.log(`Visit ${url} to get your file`);
}

run().then(() => process.exit(0));

