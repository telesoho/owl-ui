import { mount, whenReady } from "@odoo/owl";
import { Root } from "owlui/components";
import { templates } from "./assets.js";

whenReady(() => {
    console.log(templates);
    mount(Root, document.body, { templates: templates });
})
