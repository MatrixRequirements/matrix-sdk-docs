# Matrix Requirements SDK

This document is an evolving guide to using the Matrix Requirements SDK (github page [here](https://github.com/MatrixRequirements/matrix-sdk)). You can use the SDK in two ways:

1. To integrate with the Matrix Requirements web application, a demo instance of which is [here](https://demo.matrixreq.com/WHEELY). This involves inheriting functionality from certain classes and registering interest in certain "plugin" functionality. We have a [github project](https://github.com/MatrixRequirements/matrix-ui-plugin-boilerplate-24) which you can clone and go to town writing plugins.
2. To talk to a Matrix Requirement Instance from a different environment, such as **Node**. This is more about querying the database for interesting data, importing data, or making queries across multiple projects. **This document will focus on this case**, as we can more efficiently introduce important concepts in a "textual" environment.

## How do I get it?

The SDK is available as an NPM package at [https://www.npmjs.com/package/matrix-requirements-sdk](https://www.npmjs.com/package/matrix-requirements-sdk).
For this guide, we'll create JavaScript in a Node
project to illustrate our points. The steps below set up an environment and a simple code library to make connecting to a Matrix Instance easier. 

From a shell prompt, run:

``` bash
mstanton@darkstar:~/examples/users-guide (main)$ npm install matrix-requirements-sdk

added 1 package, and audited 54 packages in 1s

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

To make it easy to connect to a Matrix Instance, we'll write some code once that gets your API Token and Instance URL
from a JSON file. Create a file called `credentials.json` in the same directory like:

```
{
  "clouds5": {
    "token": "Token <INSERT YOUR TOKEN HERE>",
    "url": "https://clouds5.matrixreq.com"
  },
}
```

Now create a file `lib.js` with the following code:

``` js
const fs = require("fs");                                                       
const sdk = require("matrix-requirements-sdk/server");                          
                                                                                
// Securely connect to a server with stored credentials                         
async function getServerConnection(key) {                                       
    const credentialsFilename = "./credentials.json";                           
    const db = JSON.parse(fs.readFileSync(credentialsFilename, "utf-8"));       
    return await sdk.createConsoleAPI(db[key]);                                 
}                                                                               

module.exports = { sdk, getServerConnection };
```

`lib.js` wraps up getting the correct API Token for each Matrix Instance you'd like to connect to.
Now let's use this library to list all the Projects available on a Matrix Instance.

``` js
const lib = require("./lib.js");

async function run() {                                                          
    const server = await getServerConnection("clouds5");                        
    // List the projects available on this server:                              
    console.log((await server.getProjects()).join(", "));                       
}                                                                               
                                                                                
run().then(() => process.exit(0));
```

Save this file as `list-projects.js` and run it at the command prompt. If you've set up your credentials file
to point to the correct server and token you should receive output similar to the following:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node list-projects.js
ALM2, ALMSandbox, INSULINEPEN_SDK, MyWheely, PRINT, PRINT_ORG, QMS, QMS_FILE, TESTING_PRINT, TOOLS, 
WHEELY, WHEELY_CLEAN, WHEELY_CLIENT_TESTS, WHEELY_OBSERVABLE
```

From now on, we'll use `getServerConnection()` to make our connection to a Matrix Instance.

## Project Information

We can provide some characterization of our projects. What categories of items do they store?
We'll use the SDK to investigate this for two projects on the server, 
and show the results in an HTML table. Run the following
code to produce the table:

```js title="characterize-projects.js" 
const lib = require("./lib.js");

function getCharacterizations(projects) {
  function makeTable(proj) {
    const itemConfig = proj.getItemConfig();
    let res = '<table><thead><th scope="row">Item</th><th scope="row">Fields</th></thead><tbody>';
    let cats = itemConfig.getCategories();
    // Ignore DOCs and REPORTs for now.
    cats.splice(cats.indexOf("DOC"), 1);
    cats.splice(cats.indexOf("REPORT"), 1);
    for (let cat of cats) {
      // Get the fields of the category.
      let fields = [];
      for (let field of itemConfig.getItemConfiguration(cat).fieldList) {
          fields.push(`${field.label}(<i>${field.fieldType}</i>)`);
      }
      let renderedFields = fields.join(", ");
      res += `<tr><td>${cat}</td><td>${renderedFields}</td></tr>`;
    }
    res += `</tbody></table>`;
    return res;
  }
  let rows = "";
  for (let project in projects) {
    rows += `<tr><td>${projects[project].getName()}</td><td>${makeTable(projects[project])}</td></tr>\n`
  }
  return `<table>${rows}</table>`;
}

async function run() {
    const server = await lib.getServerConnection("clouds5");
    let projects = {};
    projects.wheely = await server.openProject("WHEELY_OBSERVABLE");
    projects.insulin = await server.openProject("INSULINEPEN_SDK");
    console.log(getCharacterizations(projects));
}

run().then(() => process.exit(0));
```

Here is the HTML output from running `node ./characterize-projects.js`.
The tables show the **Item Categories** in each project, and also the **Fields** for each kind of item.
In parenthesis, you see the **type** of the field. This is handy later when you want to examine or
modify the fields.

<table><tr><td>WHEELY_OBSERVABLE</td><td><table><thead><th scope="row">Item</th><th scope="row">Fields</th></thead><tbody><tr><td>FOLDER</td><td>Contents(<i>richtext</i>), Labels(<i>labels</i>)</td></tr><tr><td>SIGN</td><td>filter(<i>filter_file</i>), signature(<i>signature</i>), output(<i>signatureControl</i>), Labels(<i>labels</i>), Attachments(<i>fileManager</i>), signCache(<i>signCache</i>)</td></tr><tr><td>REQ</td><td>Description(<i>richtext</i>), References(<i>links</i>), Tasks(<i>tasksControl</i>), Labels(<i>labels</i>), some crosslinks(<i>crosslinks</i>)</td></tr><tr><td>UC</td><td>Description(<i>richtext</i>), Tasks(<i>tasksControl</i>), Use Case Steps(<i>test_steps</i>), Labels(<i>labels</i>), A markdown field(<i>ui-plugin-mdeditor</i>)</td></tr><tr><td>RISK</td><td>Risk(<i>risk2</i>), Cannot be reduced any further(<i>checkbox</i>), Benefits outweigh remaining risk(<i>checkbox</i>), Justification / Comments(<i>richtext</i>), Tasks(<i>tasksControl</i>), Labels(<i>labels</i>)</td></tr><tr><td>SPEC</td><td>Description(<i>richtext</i>), References(<i>links</i>), Tasks(<i>tasksControl</i>), Labels(<i>labels</i>)</td></tr><tr><td>TC</td><td>Description(<i>richtext</i>), Tasks(<i>tasksControl</i>), Steps(<i>test_steps</i>), Labels(<i>labels</i>), Steplist Simple(<i>steplist</i>), checkers(<i>checkbox</i>), a user man(<i>user</i>), gate(<i>gateControl</i>), crosslinks(<i>crosslinks</i>)</td></tr><tr><td>XTC</td><td>Description(<i>richtext</i>), Version(<i>textline</i>), Tester(<i>user</i>), Test Date(<i>date</i>), Test Run Result(<i>test_result</i>), Tasks(<i>tasksControl</i>), Test Case Steps(<i>test_steps_result</i>), Labels(<i>labels</i>)</td></tr></tbody></table></td></tr>
<tr><td>INSULINEPEN_SDK</td><td><table><thead><th scope="row">Item</th><th scope="row">Fields</th></thead><tbody><tr><td>FOLDER</td><td>Contents(<i>richtext</i>), Labels(<i>labels</i>)</td></tr><tr><td>SIGN</td><td>filter(<i>filter_file</i>), signature(<i>signature</i>), output(<i>signatureControl</i>), Labels(<i>labels</i>), Attachments(<i>fileManager</i>), signCache(<i>signCache</i>)</td></tr><tr><td>REQ</td><td>User Profile(<i>dropdown</i>), Description(<i>richtext</i>), My section(<i>section</i>), References(<i>links</i>), Labels(<i>labels</i>), xxxx(<i>richtext</i>)</td></tr><tr><td>UC</td><td>Description(<i>richtext</i>), Use Case Steps(<i>test_steps</i>), Labels(<i>labels</i>)</td></tr><tr><td>SPEC</td><td>Description(<i>richtext</i>), References(<i>links</i>), Labels(<i>labels</i>)</td></tr><tr><td>TC</td><td>Description(<i>richtext</i>), Steps(<i>test_steps</i>), Labels(<i>labels</i>)</td></tr><tr><td>RISK</td><td>Risk(<i>risk2</i>), Cannot be reduced any further(<i>checkbox</i>), Benefits outweigh remaining risk(<i>checkbox</i>), Justification / Comments(<i>richtext</i>), Tasks(<i>tasksControl</i>), Labels(<i>labels</i>)</td></tr><tr><td>XTC</td><td>Description(<i>richtext</i>), Version(<i>textline</i>), Tester(<i>user</i>), Test Date(<i>date</i>), Test Run Result(<i>test_result</i>), Test Case Steps(<i>test_steps_result</i>), Labels(<i>labels</i>)</td></tr></tbody></table></td></tr>
</table>

Note that both projects have an Item of Category `REQ`, but the fields are a bit different. In this
case, we see project `INSULINEPEN_SDK` has a "User Profile" dropdown field, which `WHEELY_CLIENT_TESTS` doesn't
have. This is because each project may define it's own categories, and those categories may consist of
whatever fields the project owner considers important.

## Items

Let's have a look at some actual Items. We can find some Item Ids using project method `searchForIds()`:

```js title="get-item-ids.js"
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    // List the projects available on this server:
    const project = await server.openProject("WHEELY_OBSERVABLE");
    const reqs = await project.searchForIds("mrql:Category=REQ");
    console.log(reqs.join(", "));
}

run().then(() => process.exit(0));
```
Running this at the command prompt returns a list of Item Ids returned by the query:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node get-item-ids.js
REQ-1, REQ-2, REQ-3, REQ-4, REQ-5, REQ-6, REQ-7, REQ-8, REQ-9, REQ-10, REQ-11, REQ-12,
REQ-13, REQ-14, REQ-15, REQ-16, REQ-17, REQ-18, REQ-19, REQ-20, REQ-21, REQ-22
mstanton@darkstar:~/examples/users-guide (main)$ 
```

The search query returned all of the items of type REQ in the `WHEELY_OBSERVABLE` project. Let's gather all information on the first one of the list:

```js title="get-one-item.js"
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    // List the projects available on this server:
    const project = await server.openProject("WHEELY_OBSERVABLE");
    const reqs = await project.searchForIds("mrql:Category=REQ");
    const wheelyFirstREQ = await project.getItem(reqs[0]); 
    console.log("ID: " + wheelyFirstREQ.getId());
    console.log("Title: " + wheelyFirstREQ.getTitle());
    const descriptionHandler = wheelyFirstREQ.getSingleFieldByName("Description").getHandler();
    const desc = descriptionHandler.getHtml();
    console.log(`Description: ${desc}`);
}

run().then(() => process.exit(0));
```

We know from the table above for `WHEELY_OBSERVABLE` that a `REQ`
Item should have five fields, one of which is **Description**. We also know that **Description** is a
*Richtext* field. The SDK provides an appropriate object to manipulate each type of field. There are
about ~20 built-in field types, and it's possible to write plug-ins that offer additional field types.
The field types are managed by objects called **Handlers**. Every Handler has a `getData()` method
which returns a string representation of the data stored in the database. But some handlers offer
additional methods to make it easier to manipulate thier unique data type. The Handler for *Richtext*
fields offers two extra methods, which are there simply to indicate the type of data the Handler deals
with: html. The methods are `getHtml()` which returns an HTML string, and `setHtml()` which
sets the data as an HTML string.

Running the code above produces:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node get-one-item.js
ID: REQ-1
Title: Design / Looks
Description: <div>The wheelchair should not look like a medical device but like something which looks
nice to kids from 6 to 10 years.</div>
<div>&nbsp;</div>
mstanton@darkstar:~/examples/users-guide (main)$ 
```

We'll continue looking into **Items** later on in the guide.

## Folder structure

A Matrix Project has a tree structure, with Items organized into Folders. A Folder is also a type of Item.
**TreeFolders** are objects that emphasize the tree/folder structure. They are also cached, so you
can query through them efficiently. Use **TreeFolder** for tasks involving moving **Items** around.
The most important methods on **TreeFolder** are:

* isRoot() - is this the root folder for the Category?
* getId()
* getTitle()
* getParent()
* getPath() - Creates a path string including all ancestor folder titles, separated by "/".
* findFolder(folderId) - Returns a TreeFolder under the current folder, if it is a descendent.
* findDirectFolderByTitle(folderTitle) - Finds a child folder with the given title if present.
* saveInFolder(item)
* moveItemsToThisFolder(itemIds) - given an array of Item Ids, moves them to the present folder.
* deleteChildItemOrFolder(itemId, force)
* getItem() - get the Item that matches this TreeFolder object.
* getFolderChildren() - returns an array of TreeFolder objects. If not yet loaded, visits the server.
* getItemChildren(): ITitleAndId[] - returns an array of title/id pairs for the Items in this folder.
* getAllChildren(): ITitleAndId[] - returns title/id pairs for all Items, including Folders in this folder.

We can examine the tree like so:

```js title="get-project-tree.js"
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
```

Running this program produces a list of full paths, which can be displayed in a fancy graph
(I did this offline with the D3 graphics library).

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node get-project-tree.js
[
  '/Reports/Project Analysis and Management/Design/Design Items',
  '/Reports/Project Analysis and Management/Risks/Risk Analysis Report',
  '/Reports/Project Analysis and Management/Testing/Test Design',
  '/Reports/Project Analysis and Management/Testing/Test Execution Status Planning',
  '/Reports/Project Analysis and Management/Testing/Test Forms',
  '/Reports/Project Analysis and Management/Traceability/Traceability Issue Report',
  '/Reports/Project Analysis and Management/Traceability/Traceability Report',
  '/Reports/Project Analysis and Management/Traceability/Outdated Traces',
  ...
```

<img src="./treediagram.svg">