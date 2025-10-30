import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseComponent } from "../base";
import { filterStyles } from "./smart-filter.style.js";
import { FilterConfig } from "./type";

@customElement("smart-filter")
export class SmartFilter extends BaseComponent {
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

  private _getComponent(config: FilterConfig, defaultId: number) {
    const baseId = `filter-${config.filterId || defaultId}`;
    switch (config.componentType) {
      case "checkbox":
        return html`<input
          type="checkbox"
          id="${baseId}"
          aria-labelledby="${baseId}-label"
          @keydown=${this._handleEscapeKey}
          @change=${(event: Event) => this._handleChange(event, config)}
        />`;
      case "dropdown":
        //TODO: Need to use smart-dropdown component here
        return html`<select
          id="${baseId}"
          aria-labelledby="${baseId}-label"
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
      <div class="filter-row" role="group" aria-label="Filters">
        ${this.config.map((data, index) => {
          const baseId = `filter-${data.filterId || index}`;
          return html`
            <div class="filter-group">
              <label id="${baseId}-label" for="${baseId}">${data.label}</label>
              ${this._getComponent(data, index)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
