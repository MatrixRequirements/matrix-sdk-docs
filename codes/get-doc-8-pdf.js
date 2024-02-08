const lib = require("./lib.js");
const fs = require("fs");
async function run() {
    const [server, wheely] = await lib.getServerAndProject();

    let doc = await wheely.getItemAsDoc("DOC-8");
    let jobId;
    let jobData;
    const urlToPDF = await doc.toPDF((jid, details) => {
        console.log(`Progress: ${details.progress}%`);
        if (details.progress == 100) {
            // When the job is finished, save information on the output.
            jobId = jid;
            jobData = details.jobFile;
        }
    });
    if (jobData) {
        // There are several output files in DOC rendering, focus on the one which is the PDF.
        let fileInfo = jobData.filter(d => d.restUrl == urlToPDF)[0];
        console.log(`Downloading Job ${jobId} File ${fileInfo.jobFileId} as download.pdf...`);
        let result = await wheely.downloadJobResult(jobId, fileInfo.jobFileId);
        fs.writeFileSync("download.pdf", Buffer.from(result));
    }
}

run().then(() => process.exit(0));
