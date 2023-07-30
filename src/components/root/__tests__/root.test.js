// jest.useFakeTimers(); // Use this to test timeout
import { Root } from "../root";
import { nextTick, makeTestFixture, loadAllTemplates } from '../../../helper.js';
import { mount, Component, useState, xml } from "@odoo/owl";


//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------
let fixture
let env;
let templates;

beforeEach(async () => {
    fixture = makeTestFixture();
    templates = await loadAllTemplates("src/components");
});

afterEach(() => {
    fixture.remove();
});
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
describe("Root", () => {
    test("component behaves as expected", async () => {
        const props = { templates: templates }; // depends on the component
        await mount(Root, fixture, props);
        await nextTick();
        console.info(fixture.innerHTML)
        const el = fixture.querySelector('div.root');
        el.click();
        await nextTick();
        console.info(fixture.innerHTML)
    });

});
