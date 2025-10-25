import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../index";

@customElement("demo-page")
export class DemoPage extends LitElement {
  render() {
    return html`
      <h1>Smart Search Component Demo</h1>

      <div class="demo-section">
        <h2>Basic Search Input</h2>
        <smart-search id="smart-search"></smart-search>
      </div>
    `;
  }
}
