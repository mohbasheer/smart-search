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

  @property({ type: String })
  targetItemId?: string;

  private _handleItemClick(item: SearchResultItem) {
    this.dispatchEvent(
      new CustomEvent("item-selected", {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _getCSSClass = (item: SearchResultItem) => {
    let cssClass = "";
    if (this.activeItemId === item.id) {
      cssClass = "active";
    } else if (this.targetItemId === item.id) {
      cssClass = "target";
    }
    return cssClass;
  };

  private _handleMouseOver = (event: MouseEvent) => {
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

  render() {
    return html`
      <ul role="listbox" @mouseover=${this._handleMouseOver}>
        ${this.items.map(
          (item) => html`
            <li
              role="option"
              id=${item.id}
              class=${this._getCSSClass(item)}
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
