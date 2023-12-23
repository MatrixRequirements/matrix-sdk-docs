const fs = require("fs");
const lib = require("./lib.js");
const axios = require("axios");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    // Upload the file.
    server.setComment("Creating attachment");
    const filePath = __dirname + "/resources/typewriter.jpg";
    let file = fs.createReadStream(filePath);
    const addFileAck = await wheely.uploadLocalFile(axios, file);
    console.log(`Uploaded ${filePath} to ${wheely.computeFileUrl(addFileAck)}`);

    // Save to "Files" in SPEC-2.
    let spec = await wheely.getItem("SPEC-2");
    let handler = spec.getFieldByName("Files")[0].getHandler();
    // the field may have no data (undefined or empty string).
    let fileData = [];
    if (handler.getData() !== undefined && handler.getData() !== "") {
        fileData = JSON.parse(handler.getData());
    }
    fileData.push({
        fileName: "typewriter.jpg",
        fileId: `${addFileAck.fileId}?key=${addFileAck.key}`
    });
    console.dir(fileData, { depth: null, colors: true });
    handler.setData(JSON.stringify(fileData));
    spec = await wheely.updateItem(spec);
    console.log(`Updated ${spec.getId()}`);
}

run().then(() => process.exit(0));
