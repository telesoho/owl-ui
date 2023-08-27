import { mount, whenReady } from "@odoo/owl";
import { Hello } from "owlui/components";
import { templates } from "./assets.js";

whenReady(() => {
    console.log(templates);
    mount(Hello, document.body, { templates: templates });
})
