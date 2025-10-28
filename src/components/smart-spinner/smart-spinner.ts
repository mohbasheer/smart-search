import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./smart-spinner.styles.js";

@customElement("smart-spinner")
export class SmartSpinner extends LitElement {
  static styles = styles;

  @property({ type: String, reflect: true })
  theme: string = "light";

  protected render() {
    return html`<div class="spinner"></div>`;
  }
}
