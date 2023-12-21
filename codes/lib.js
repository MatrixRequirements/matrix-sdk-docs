const fs = require("fs");
const sdk = require("matrix-requirements-sdk/server");

// Securely connect to a server with stored credentials
async function getServerConnection(key) {
    const credentialsFilename = "./credentials.json";
    const db = JSON.parse(fs.readFileSync(credentialsFilename, "utf-8"));
    return await sdk.createConsoleAPI(db[key]);
}

async function getServerAndProject(connection, projectName) {
    if (connection == undefined) {
        connection = "clouds5";
    }
    if (projectName == undefined) {
        projectName = "WHEELY_OBSERVABLE";
    }
    const server = await getServerConnection(connection);
    const wheely = await server.openProject(projectName);
    return [server, wheely];
}

module.exports = { sdk, getServerConnection, getServerAndProject };
