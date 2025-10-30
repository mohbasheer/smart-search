import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseComponent } from "../base.js";
import { styles } from "./smart-spinner.styles.js";

@customElement("smart-spinner")
export class SmartSpinner extends BaseComponent {
  static styles = styles;

  protected render() {
    return html`<div class="spinner"></div>`;
  }
}
