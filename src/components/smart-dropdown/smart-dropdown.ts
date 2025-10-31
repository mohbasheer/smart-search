import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseComponent } from "../base.js";
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
export class SmartDropdown extends BaseComponent {
  static styles = [dropdownStyles];

  @property({ type: Array })
  items: SearchResultItem[] = [];

  @property({ type: String })
  focusedItemId?: string;

  private _handleItemClick(item: SearchResultItem) {
    this.dispatchEvent(
      new CustomEvent("item-selected", {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handlePointerOver = (event: PointerEvent) => {
    if (event.target) {
      const element = event.target as HTMLElement;
      const itemId = element.id;
      this.dispatchEvent(
        new CustomEvent("item-hovered", {
          detail: { itemId },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("focusedItemId") && this.focusedItemId) {
      const focusedElement = this.shadowRoot?.querySelector(
        `#${this.focusedItemId}`
      );
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }

  render() {
    return html`
      <ul
        role="listbox"
        id=${`${this.id}-dropdown-listbox`}
        aria-label="Dropdown options"
        @pointerover=${this._handlePointerOver}
      >
        ${this.items.map(
          (item) => html`
            <li
              role="option"
              id=${item.id}
              class=${this.focusedItemId === item.id ? "selected" : ""}
              aria-selected=${this.focusedItemId === item.id ? "true" : "false"}
              @click=${() => this._handleItemClick(item)}
            >
              ${item.primaryText}
            </li>
          `
        )}
      </ul>
    `;
  }
}
