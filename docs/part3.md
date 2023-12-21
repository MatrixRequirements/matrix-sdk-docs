# Links, Labels and Item Creation

Matrix is designed such that items of a particular Category may link to other items of some particular Categories.
For example, a Requirement should link to a Specification. A Specification to a Test, and a Test to an Executed Test.
We call this [Traceability](https://docs23.matrixreq.com/usv23/traceability-rules) in the documentation.

You can explore the traceability rules for a project with the `ItemConfiguration` class. Let's focus on which categories link to each other, and create/edit some links between them. Here I've compiled the information into a drawing showing those categories which have downlinks: 

```js title="relationships.js"
--8<-- "./codes/relationships.js"
```

You'll see I also added a method to our library to return the server and project, `lib.getServerAndProject(connection, projectName)`,
with appropriate default values for my server.

The output, processed with GraphViz:

```graphviz dot relationships-output.svg
digraph {
  REQ -> SPEC
  SPEC -> TC
 rankdir="LR";
}
```

## Altering Downlinks in one Item

Let's write a program that finds a random SPEC item which links to a TC. We'll remove the TC link and ensure that our now-changed
item doesn't show up in the original query for SPECs which link to TCs. Then we'll put things back as we found them.
This demonstrates making changes that affect the server.

```js linenums="1" title="change-downlink.js"
--8<-- "./codes/change-downlink.js"
```

Note **line 21** where we save our changes to the server. `Project.updateItem()` returns a fresh copy of the item.
Running the application gives the following output:

```bash
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$ node change-downlink
Debugger attached.
Found 4 SPEC Items that have TC downlinks. Choosing SPEC-11 at random.
SPEC-11 linked to TC-4
Item updated...re-running search query..
Success changing and restoring SPEC-11.
Waiting for the debugger to disconnect...
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$
```

## Labels

Labels in Matrix are quite sophisticated. In the WHEELY_CLIENT_TESTS project, there is an "XOR" label with two values:

* DAYTIME
* NIGHTTIME

If one of these labels is set on an Item, then the other is set, the first label will be removed. The client enforces the label rules.
Additionally, labels can be limited to particular categories. Let's try and set the DAYTIME label on a REQ.

```js title="bad-set-label.js"
--8<-- "./codes/bad-set-label.js"
```

Looking at the output, we've been rebuked!

```bash
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$ node bad-set-label
/Users/mstanton/work/matrix-sdk-docs/codes/node_modules/matrix-requirements-sdk/server/index.js:8535
                throw new Error(`Category ${this.type} doesn't allow labels`);
                      ^

Error: Category REQ doesn't allow labels
    at Item.verifyLabelsAllowed (/Users/mstanton/work/matrix-sdk-docs/codes/node_modules/matrix-requirements-sdk/server/index.js:8535:23)
    at Item.setLabel (/Users/mstanton/work/matrix-sdk-docs/codes/node_modules/matrix-requirements-sdk/server/index.js:8559:14)
    at run (/Users/mstanton/work/matrix-sdk-docs/codes/bad-set-label.js:9:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

Node.js v18.11.0
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$ 
```

Note that the exception was thrown on the call to `Item.setLabel()`, and no trip to the server was made. This is because the
SDK has the label configuration locally, and can enforce those rules. Looking at the Label settings, we see that this label only
works on TC Items:

![Screenshot](img/label-settings.png)

Let's retrieve an existing TC Item and do some experiments. We've also got "OR" labels "ORANGE" and "APPLE" in our Label configuration.

```js title="set-labels.js"
--8<-- "./codes/set-labels.js"
```

Running the code above, we get:

```bash
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$ node set-labels
TC-1: Initial state
  Labels: ORANGE, NIGHTTIME, FORPRINTING
TC-1: After set of DAYTIME (xor label)
  Labels: ORANGE, FORPRINTING, DAYTIME
TC-1: After set of NIGHTTIME (xor label)
  Labels: ORANGE, FORPRINTING, NIGHTTIME
TC-1: After set of APPLE and ORANGE (or labels)
  Labels: ORANGE, FORPRINTING, NIGHTTIME, APPLE
TC-1: After unset of DAYTIME (should have no effect)
  Labels: ORANGE, FORPRINTING, NIGHTTIME, APPLE
TC-1: Labels set to empty
  Labels: 
mstanton@darkstar:~/work/matrix-sdk-docs/codes (main)$ node set-labels
```
