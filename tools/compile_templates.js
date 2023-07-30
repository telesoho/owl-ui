import { getXmlFiles, compileTemplates } from "../src/helper.js";
import fs from "fs";
import path from "path";

function writeToFile(filepath, data) {
    if (!fs.existsSync(path.dirname(filepath))) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    fs.writeFile(filepath, data, (err) => {
        if (err) {
            process.stdout.write(`Error while writing file ${filepath}: ${err}`);
            return;
        }
    });
}


const templatesPath = process.argv[2];
if (templatesPath && templatesPath.length) {
    getXmlFiles(templatesPath).then(async (files) => {
        const result = await compileTemplates(files);
        writeToFile("dist/templates.xml", result.join());
    });
} else {
    console.log("Please provide a path");
}
