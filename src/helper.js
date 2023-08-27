import fs from "fs";
import path from "path";

let lastFixture = null;

export async function getXmlFiles(dir) {
  let xmls = [];
  const files = await fs.promises.readdir(dir);
  const filesStats = await Promise.all(files.map((file) => fs.promises.stat(path.join(dir, file))));
  for (let i in files) {
    const name = path.join(dir, files[i]);
    if (filesStats[i].isDirectory()) {
      xmls = xmls.concat(await getXmlFiles(name));
    } else {
      if (name.endsWith(".xml")) {
        xmls.push(name);
      }
    }
  }
  return xmls;
}

export async function compileTemplates(files) {
  process.stdout.write(`Processing ${files.length} files`);
  let xmlStrings = await Promise.all(files.map((file) => fs.promises.readFile(file, "utf8")));
  return xmlStrings;
}

export async function loadAllTemplates(dir) {
  let templates;
  const files = await getXmlFiles(dir);
  const xmls = await compileTemplates(files);
  templates = loadTemplatesFromXML(xmls.join());
  return templates;
}

export function makeTestFixture() {
  let fixture = document.createElement("div");
  document.body.appendChild(fixture);
  if (lastFixture) {
    lastFixture.remove();
  }
  lastFixture = fixture;
  return fixture;
}

export async function nextTick() {
  await new Promise((resolve) => setTimeout(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

export function nextMicroTick() {
  return Promise.resolve();
}

export function loadTemplatesFromXML(xml) {
  const templates = new DOMParser().parseFromString("<odoo/>", "text/xml");
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) {
    // The generated error XML is non-standard so we log the full content to
    // ensure that the relevant info is actually logged.
    throw new Error(doc.querySelector("parsererror").textContent.trim());
  }

  for (const element of doc.querySelectorAll("templates > [t-name][owl]")) {
    element.removeAttribute("owl");
    const name = element.getAttribute("t-name");
    const previous = templates.querySelector(`[t-name="${name}"]`);
    if (previous) {
      console.debug("Override template: " + name);
      previous.replaceWith(element);
    } else {
      templates.documentElement.appendChild(element);
    }
    console.debug(`Add ${name} templates on window Owl container.`);
  }
  return templates;
}
