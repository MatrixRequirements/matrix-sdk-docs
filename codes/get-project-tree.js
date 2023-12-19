/*
The data output by this function was run through D3 on ObservableHQ.com with the following settings.
Variable treeData below contained the array of strings output by this program.
Plot.plot({
  axis: null,
  height: 1400,
  margin: 20,
  marginRight: 120,
  marks: [
    Plot.tree(treeData, {textStroke: "white"})
  ]
})
*/
const lib = require("./lib.js");

function convertToTreePaths(treeFolder) {
    let obj = [];
    const itemChildren = treeFolder.getItemChildren();
    const folderChildren = treeFolder.getFolderChildren();
    if (itemChildren.length == 0 && folderChildren.length == 0) {
        obj.push(treeFolder.getPath());
        return obj;
    }
  
    for (let item of itemChildren) {
        obj.push(treeFolder.getPath() + "/" + item.title);
    }
  
    for (let folder of folderChildren) {
        let childData = convertToTreePaths(folder);
        obj = obj.concat(childData);
    }
    return obj;
}

async function run() {
    const server = await lib.getServerConnection("clouds5");
    // List the projects available on this server:
    const project = await server.openProject("WHEELY_OBSERVABLE");
    const wheelyTree = await project.getProjectTree();
    const mytree = convertToTreePaths(wheelyTree);
    console.log(mytree);
}

run().then(() => process.exit(0));

