import * as xmls from 'bundle-text:../src/components/*/*.xml';

console.debug("xmls", xmls);

const templates = new DOMParser().parseFromString("<odoo/>", "text/xml");

function _loadXMLString(xml) {
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
};

function loadXML(xmls) {
    if (xmls instanceof Object) {
        for (const xmlvalue of Object.values(xmls)) {
            loadXML(xmlvalue);
        }
    } else if (typeof (xmls) === "string") {
        _loadXMLString(xmls);
    }
}

loadXML(xmls);

export { templates, loadXML }