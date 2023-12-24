const lib = require("./lib.js");

async function run() {
    const [server, wheely] = await lib.getServerAndProject();
    let ucs = await wheely.searchForItems("mrql:category=UC");
    let todoId1 = await ucs[0].createTodo(["mike"], "user", "Here is a notification", new Date());
    let todoId2 = await ucs[1].createTodo(["francois"], "user", "Here is a notification", new Date());
    console.log(`Created Todos ${todoId1}, ${todoId2}`);
    const todos = await wheely.getTodos(undefined, undefined, true);
    console.dir(todos, {});
}

run().then(() => process.exit(0));

