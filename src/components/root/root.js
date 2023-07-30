import { Component, xml, useState } from "@odoo/owl";
export class Root extends Component {
  state = useState({ text: "Owl" });
  update() {
    this.state.text = this.state.text === "Owl" ? "World" : "Owl";
  }
}
Root.template = 'owlui.root';
