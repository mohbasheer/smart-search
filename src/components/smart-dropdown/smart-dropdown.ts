import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { dropdownStyles } from "./smart-dropdown.style.js";

export interface DropdownItem {
  id: string;
  text: string;
}

@customElement("smart-dropdown")
export class SmartDropdown extends LitElement {
  static styles = [dropdownStyles];

  @property({ type: Array })
  items: DropdownItem[] = [];

  @property({ type: String })
  activeItemId?: string;

  private _handleItemClick(item: DropdownItem) {
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
              @click=${() => this._handleItemClick(item)}
            >
              ${item.text}
            </li>
          `
        )}
      </ul>
    `;
  }
}
