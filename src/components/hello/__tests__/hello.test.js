// jest.useFakeTimers(); // Use this to test timeout
import { Hello } from "../hello";
import { nextTick, makeTestFixture, loadAllTemplates } from '../../../helper.js';
import { mount } from "@odoo/owl";


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
describe("Hello sample component", () => {
    test("component behaves as expected", async () => {
        const props = { templates: templates }; // depends on the component
        await mount(Hello, fixture, props);
        await nextTick();
        console.debug(fixture.innerHTML)
        const el = fixture.querySelector('div.hello');
        el.click();
        await nextTick();
        console.debug(fixture.innerHTML)
    });

});
