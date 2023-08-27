import { Component, useState } from "@odoo/owl";
export class Hello extends Component {
  state = useState({ text: "Owl" });
  update() {
    this.state.text = this.state.text === "Owl" ? "World" : "Owl";
  }
}
Hello.template = "owlui.hello";
