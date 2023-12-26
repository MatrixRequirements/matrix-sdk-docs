const lib = require("./lib.js");
const assert = require("assert");

async function getOrCreateOutputFolder(project, parent, name) {
    let tree = await project.getProjectTree();
    let xtcs = tree.findFolder(parent);
    let outputFolder = xtcs.findDirectFolderByTitle(name);
    if (outputFolder == null) {
        let folderItem = project.createFolder("XTC");
        folderItem.setTitle(name);
        folderItem = await project.putItem(parent, folderItem);
        return folderItem.getId();
    }
    return outputFolder.getId();
}

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    server.setComment("Creating XTCs");
    let tree = await wheely.getProjectTree();
    let tcFolder = tree.findFolder("F-TC-1");
    // We expect the root TC folder to have some items.
    assert(tcFolder.getItemChildren().length > 0);
    let param = wheely.createExecuteParamWithDefaults(['F-TC-1'], 'XTC', 
        "Create XTCs " + performance.now().toString());
    param.parentFolder = await getOrCreateOutputFolder(wheely, "F-XTC-1", "Test Results");
    console.dir(param);
    const result = await wheely.execute(param);
    console.log(`Created folder ${result.folder}`);
}

run().then(() => process.exit(0));

