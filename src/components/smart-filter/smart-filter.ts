import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FilterConfig } from "./type";

@customElement("smart-filter")
export class SmartFilter extends LitElement {
  @property({ attribute: false })
  config: FilterConfig[] = [];

  private _handleChange = (event: Event, config: FilterConfig) => {
    const el = event.target as HTMLInputElement;
    const value = config.componentType === "checkbox" ? el.checked : el.value;
    this.dispatchEvent(
      new CustomEvent("filter-applied", {
        detail: { filterId: config.filterId, value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleEscapeKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      (event.target as HTMLInputElement).blur();
    }
  }

  private _getComponent(config: FilterConfig) {
    switch (config.componentType) {
      case "checkbox":
        return html`<input
          type="checkbox"
          @keydown=${this._handleEscapeKey}
          @change=${(event: Event) => this._handleChange(event, config)}
        />`;
      default:
        return "";
    }
  }

  protected render() {
    return html`
      <div>
        ${this.config.map((data) => {
          return html`
            <div>
              <label>${data.label}</label>
              ${this._getComponent(data)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
