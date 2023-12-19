const lib = require("./lib.js");

lib.getServerConnection("clouds5").then((server) => {
    server.openProject("WHEELY_OBSERVABLE").then(async (project) => {
        project.searchForItems("mrql:category=REQ or category=UC").then((items) => {
            console.log(server.getFetchLog().join("\n"));
        });
    });
});
