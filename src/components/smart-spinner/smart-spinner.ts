import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "./smart-spinner.styles.js";

@customElement("smart-spinner")
export class SmartSpinner extends LitElement {
  static styles = styles;

  protected render() {
    return html`<div class="spinner"></div>`;
  }
}
