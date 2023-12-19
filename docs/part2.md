# Advanced Searching

This document is part of an guide to using the Matrix Requirements SDK (github page [here](https://github.com/MatrixRequirements/matrix-sdk),
and part one of this guide [here](./index.md)). We'll continue working in the Node environment established in [part one](./index.md).

We've already seen the method `Project.searchForIds()` which takes a query string and returns a list of Item IDs.
But we may want to execute more sophisticated searches, and for this we have two methods:

* `searchForItems(term, filter, treeOrder, mask)` which returns an array of `Item` objects, and
* `searchRaw(term, options)` which returns an array of `ISearchResult` objects.

The methods do the same thing, but **searchForItems** is designed to be friendlier to work with.

## Searching with a mask

We'll create a mask that gives us back *partial Items* with only one field brought down from the server:

```js title="partial-search-1.js"
const assert = require("assert");
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");
    // Construct a mask that includes fields, but no labels or up or down links.
    let mask = wheely.constructSearchFieldMask(true, false, false, false);
    const catREQ = wheely.getCategory("REQ");
    const descriptionFieldId = catREQ.getFieldIdFromLabel("Description")[0];
    mask.addMask(catREQ, [descriptionFieldId]);

    // Now bring down all Items of category REQ with this field mask.
    const reqs = await wheely.searchForItems("mrql:category=REQ", "", false, mask);

    let rows = [];
    for (let i = 0; i < Math.min(5, reqs.length); i++) {
        const item = reqs[i];
        assert(!item.hasAllFields());
        assert(item.hasFieldId(descriptionFieldId));

        const id = item.getId();
        const title = item.getTitle();
        const descriptionField = item.getSingleFieldByName("Description").getHandler();
        const description = descriptionField.getHtml();
        rows.push(`<tr><td>${id}</td><td>${title}</td><td>${description}</td></tr>`);
    }
    console.log(`<table>${rows.join('\n')}</table>`);
}

run().then(() => process.exit(0));
```

Note that we asserted that the Items brought down only have the one Category REQ field we asked for, "Description". Typical HTML output is below:

<table><tr><td>REQ-1</td><td>Design / Looks</td><td><div>The wheelchair should not look like a medical device but like something which looks nice to kids from 6 to 10 years.</div>
<div>&nbsp;</div></td></tr>
<tr><td>REQ-2</td><td>Sized for Kids</td><td><div xmlns="http://www.w3.org/1999/xhtml"><div xmlns="http://www.w3.org/1999/xhtml">The wheelchair should fit all standard heights and weights for kids from 6 to 12 years of age.<div><br /></div>

<div id="maincontent2" style="margin: 0px; padding: 0px;"><div id="main-body" style="float: left; width: 612px;"><div id="main-content" style="color: rgb(51, 51, 51); margin: 0px 0px 10px; overflow: hidden;"><div id="article-content"><div id="main-content" style="margin: 0px 0px 10px; overflow: hidden;"><div id="714"><h4 align="center" style="color: rgb(51, 51, 51); line-height: 1.6em; margin: 0px 5px; padding: 0px; font-weight: bold;">3 to 15 Years</h4><table cellspacing="0" cellpadding="0" border="1" style="font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif; font-size: x-small; margin: 0px;"><tbody><tr><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Boys</p></th><th valign="top" width="216" colspan="2" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p align="center" style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Average Values</p></th><th valign="top" width="216" colspan="2" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p align="center" style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Normal Range</p></th></tr><tr><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Age (Years)</p></th><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Weight (Pounds)</p></th><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Length (Inches)</p></th><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Weight (Pounds)</p></th><th valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(62, 109, 142); font-size: small; padding: 5px 10px; background-color: rgb(163, 180, 96);"><p style="color: rgb(255, 255, 255); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-family: arial; font-weight: normal;">Length (Inches)</p></th></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">2</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">27.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">34.2</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">22.8-33.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">31.7-36.3</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">3</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">31.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">37.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">26.1-38.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">35.2-39.8</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">4</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">36.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">40.3</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">29.0-44.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">37.5-43.2</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">40.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">43.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">33.0-52.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">39.8-45.7</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">6</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">45.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">45.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">36.5-59.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">42.2-48.6</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">7</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">50.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">48.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">40.5-68.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">44.5-51.3</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">8</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">56.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">50.4</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">45.0-77.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">46.7-54.3</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">9</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">63.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">52.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">49.5-88.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">48.7-56.5</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">10</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">70.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">54.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">56.0-100.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">50.5-58.8</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">11</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">78.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">56.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">60.5-114.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">52.0-61.0</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">12</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">88.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">58.7</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">66.5-130.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">54.0-63.5</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">13</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">100.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">61.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">74.5-144.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">56.3-66.6</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">14</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">112.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">64.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">84.0-159.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">59.1-69.7</p></td></tr><tr><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">15</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">123.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">67.0</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">92.5-172.5</p></td><td valign="top" width="108" style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(216, 221, 239); color: rgb(68, 68, 68); padding: 5px 10px;"><p style="color: rgb(51, 51, 51); line-height: 1.5em; margin-top: 5px; margin-bottom: 8px; padding: 0px 5px; font-size: 13px; font-family: Arial, Verdana, Geneva, sans-serif;">61.6-71.7</p></td></tr></tbody></table></div></div></div><div></div></div></div></div></div></div></td></tr>
<tr><td>REQ-3</td><td>Wheels</td><td><div xmlns="http://www.w3.org/1999/xhtml">There must be 4 wheels makes it better</div></td></tr>
<tr><td>REQ-4</td><td>Seat</td><td><div xmlns="http://www.w3.org/1999/xhtml">There must be a seat which<div><ul><li>is comfortable for extended periods of sitting (&gt; 8 hours)</li><li>can be cleaned easily</li></ul><br /></div></div></td></tr>
<tr><td>REQ-5</td><td>Tablet / Ipad  Holder</td><td><div xmlns="http://www.w3.org/1999/xhtml">The wheelchair must allow to attach a table from 7" to 11"</div></td></tr></table>

## Masking across multiple Categories

What if we are looking for the **Description** field if we have a **REQ** Item, and the **Use Case Steps** field if we have a **UC** item?
No problem! You can construct the mask so that it will apply correctly to each kind of item returned:

```js title="partial-search-2.js"
const assert = require("assert");
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");

    // Construct a mask that includes fields, but no labels or up or down links.
    let mask = wheely.constructSearchFieldMask(true, false, false, false);

    const catREQ = wheely.getCategory("REQ");
    const descriptionFieldId = catREQ.getFieldIdFromLabel("Description")[0];
    mask.addMask(catREQ, [descriptionFieldId]);

    const catUC = wheely.getCategory("UC");
    const ucStepsFieldId = catUC.getFieldIdFromLabel("Use Case Steps")[0];
    mask.addMask(catUC, [ucStepsFieldId]);

    // Now bring down all Items of category REQ and UC with this field mask.
    const reqs = await wheely.searchForItems("mrql:category=REQ or category=UC", "", false, mask);

    let reqCount = 0, ucCount = 0;
    for (let i = 0; i < reqs.length; i++) {
        const item = reqs[i];
        assert(!item.hasAllFields());

        if (item.getCategory() == catUC) {
            assert(item.hasFieldId(ucStepsFieldId));
            ucCount++;
        } else if (item.getCategory() == catREQ) {
            assert(item.hasFieldId(descriptionFieldId));
            reqCount++;
        }
    }
    console.log(`Project has ${reqCount} REQ Items, and ${ucCount} UC Items`);
}

run().then(() => process.exit(0));
```

Run this program for the following result:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node partial-search-2
Project has 22 REQ Items, and 3 UC Items
mstanton@darkstar:~/examples/users-guide (main)$ 
```

## Category object also returns search results

If you want to get all the items for a particular Category, you can request this directly from the
Category object without using one of the search methods already mentioned, see line 15 below. And you can still
use a mask to retrieve partial items if you like.

```js linenums="1" title="partial-search-3"
const assert = require("assert");
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");

    // Construct a mask that includes fields, but no labels or up or down links.
    let mask = wheely.constructSearchFieldMask(true, false, false, false);

    const catUC = wheely.getCategory("UC");
    const ucStepsFieldId = catUC.getFieldIdFromLabel("Use Case Steps")[0];
    mask.addMask(catUC, [ucStepsFieldId]);

    const UCs = await catUC.getItems({ mask });
    let total = 0;
    for (let uc of UCs) {
        assert(!uc.hasAllFields());
        assert(uc.hasFieldId(ucStepsFieldId));

        const fieldHandler = uc.getFieldById(ucStepsFieldId).getHandler();
        total += fieldHandler.getRowCount();
    }
    console.log(`The average number of Use Case Steps in UC Items is ${total / UCs.length}`);
}

run().then(() => process.exit(0));
```

And the output follows:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node partial-search-3
The average number of Use Case Steps in UC Items is 5.666666666666667
mstanton@darkstar:~/examples/users-guide (main)$ 
```

## A search retrieving Label information

Of course, maybe you don't want any Fields to be brought down at all, only, say, labels.
It's all in the `constructSearchFieldMask()` function, where the first parameter, **includeFields** is a boolean
value. The second parameter, **includeLabels** is also a boolean. Both of these have a default value of
true if left unspecified. The next two parameters, **includeDownlinks** and **includeUplinks** have a default
value of false. Let's have a code example where we get Item objects, but no Category Fields, thus reducing
download time. We get all the labels and print out the ones we found:


```js title="partial-search-4.js"
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");

    // Construct a mask that only includes labels.
    let mask = wheely.constructSearchFieldMask(false, true, false, false);

    const catUC = wheely.getCategory("UC");
    const ucStepsFieldId = catUC.getFieldIdFromLabel("Use Case Steps")[0];
    mask.addMask(catUC, [ucStepsFieldId]);

    const items = await wheely.searchForItems("mrql:category=TC", "", false, mask);
    let foundLabels = new Set();
    for (let item of items) {
        for (let label of item.getLabels()) {
            foundLabels.add(label);
        }
    }
    let output = [];
    for (let l of foundLabels.values()) output.push(l);
    console.log(`Found the following labels on TC Items: ${output.join(", ")}`);
}

run().then(() => process.exit(0));
```

And the output:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node partial-search-4.js
Found the following labels on TC Items: ORANGE, NIGHTTIME, FORPRINTING, APPLE
mstanton@darkstar:~/examples/users-guide (main)$ 
```

Cool, we can see our Labels on TCs.

## "Raw" (low-level) search results

If you want, you can go more "old school" and use method `searchRaw()` which takes parameter **fieldList**. You can use
the mask as we've described to come up with your field mask, and then you can ask the mask for it's **fieldMaskString** in order
to fill in that parameter correctly. Note that the field IDs are referenced, because those are unique:

```js title="partial-search-5.js"
const lib = require("./lib.js");

function getMaskString(project) {
    // Construct a mask for the purposes of getting a mask field string
    let mask = project.constructSearchFieldMask(true, false, false, false);
    const catREQ = project.getCategory("REQ");
    mask.addMaskByNames(catREQ, ["Description"]);
    const catUC = project.getCategory("UC");
    mask.addMaskByNames(catUC, ["Use Case Steps"]);
    return mask.getFieldMaskString();
}

async function run() {
    const server = await lib.getServerConnection("clouds5");
    const wheely = await server.openProject("WHEELY_OBSERVABLE");
    const maskString = getMaskString(wheely);
    let searchResults = await wheely.searchRaw("mrql:category=REQ or category=UC", "", maskString);
    for (let result of searchResults) {
        const strValue = JSON.stringify(result);
        console.log(`${strValue.substring(0, 60)}...`);
    }
}

run().then(() => process.exit(0));
```

The output of `searchRaw` isn't wrapped into **Item** objects, but remains in a low-level type:

```bash
mstanton@darkstar:~/work/matrix-sdk/examples/users-guide (main)$ node partial-search-5
{"itemId":"REQ-1","version":3,"title":"Design / Looks","down...
{"itemId":"REQ-2","version":3,"title":"Sized for Kids","down...
{"itemId":"REQ-3","version":24,"title":"Wheels","downlinks":...
{"itemId":"REQ-4","version":1,"title":"Seat","downlinks":[],...
...
```

## Continuous Log of REST requests

The SDK also has information about the REST calls made to the server over time. There is a list of the calls made. You might use this
list to verify that only one call was made for a powerful search request. Let's have a look at the ${projects.sdk.getFetchLog().length} calls we've made to this
point in our document:

```js title="search-fetchlog.js"
const lib = require("./lib.js");

async function run() {
    const server = await lib.getServerConnection("clouds5");
    await (await server.openProject("WHEELY_OBSERVABLE"))
        .searchForItems("mrql:category=REQ or category=UC");
    console.log(server.getFetchLog().join("\n"));
}

run().then(() => process.exit(0));
```

You can see 3 calls were made:

```bash
mstanton@darkstar:~/examples/users-guide (main)$ node search-fetchlog
https://clouds5.matrixreq.com/rest/1/
https://clouds5.matrixreq.com/rest/1/WHEELY_OBSERVABLE?adminUI=1
https://clouds5.matrixreq.com/rest/1/WHEELY_OBSERVABLE/needle
mstanton@darkstar:~/examples/users-guide (main)$ 
```

One for Server information. The second call for Project information. The final request ("needle") is the search.
We were finding needles in haystacks today.