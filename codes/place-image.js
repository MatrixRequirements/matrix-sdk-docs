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

    // Find a UC and add the image to the bottom of the description.
    wheely.getCategory("UC").create
    const ucIds = await wheely.searchForIds("mrql:category=UC");
    // Take the first one.
    let uc = await wheely.getItem(ucIds[0]);
    let handler = uc.getFieldByName("Description")[0].getHandler();
    let text = handler.getHtml();
    text += `Adding an image with the SDK: <img width="400" src="${url}"><br>`;
    handler.setHtml(text);
    uc = await wheely.updateItem(uc);
    console.log(`Added image to ${uc.getId()}`);
}

run().then(() => process.exit(0));
