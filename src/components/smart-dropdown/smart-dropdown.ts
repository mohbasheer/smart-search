import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { dropdownStyles } from "./smart-dropdown.style.js";

export interface SearchResultItem<T = any> {
  id: string;
  primaryText: string;
  secondaryText?: string;
  icon?: string;
  value?: string;
  isDisabled?: boolean;
  original: T;
}

@customElement("smart-dropdown")
export class SmartDropdown extends LitElement {
  static styles = [dropdownStyles];

  @property({ type: Array })
  items: SearchResultItem[] = [];

  @property({ type: String })
  activeItemId?: string;

  private _handleItemClick(item: SearchResultItem) {
    this.dispatchEvent(
      new CustomEvent("item-selected", {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <ul role="listbox">
        ${this.items.map(
          (item) => html`
            <li
              role="option"
              id=${item.id}
              class=${this.activeItemId === item.id ? "active" : ""}
              @mousedown=${() => this._handleItemClick(item)}
            >
              ${item.primaryText}
            </li>
          `
        )}
      </ul>
    `;
  }
}
