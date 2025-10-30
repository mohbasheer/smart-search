import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FilterConfig } from "./type";
import { filterStyles } from "./smart-filter.style.js";

@customElement("smart-filter")
export class SmartFilter extends LitElement {
  static styles = [filterStyles];
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
      case "dropdown":
        return html`<select
          @keydown=${this._handleEscapeKey}
          @change=${(event: Event) => this._handleChange(event, config)}
        >
          ${config.options?.map(
            (option) =>
              html`<option value=${option.value}>${option.label}</option>`
          )}
        </select>`;
      case "date-picker":
        //TODO : Implement date picker component
        return html``;
      default:
        return "";
    }
  }

  protected render() {
    return html`
      <div class="filter-row">
        ${this.config.map((data) => {
          return html`
            <div class="filter-group">
              <label>${data.label}</label>
              ${this._getComponent(data)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
