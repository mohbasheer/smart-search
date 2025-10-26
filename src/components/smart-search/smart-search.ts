import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { debounce } from "../../utils/debounce.js";
import { styles } from "./smart-search.styles.js";

import "../smart-dropdown/smart-dropdown.js";
import "../smart-input/smart-input.js";
import "../smart-spinner/smart-spinner.js";
import "../smart-clear-button/smart-clear-button.js";
import { SearchResultItem } from "../smart-dropdown/smart-dropdown.js";

type SearchProvider = (query: string) => Promise<any[]>;

@customElement("smart-search")
export class SmartSearch extends LitElement {
  static styles = styles;

  @property({ attribute: false })
  searchProvider: SearchProvider = async () => [];

  @property({ attribute: false })
  resultMapper: (item: any) => SearchResultItem = (item: any) => item;

  @state()
  private _items: SearchResultItem[] = [];

  @state()
  private _isLoading = false;

  @state()
  private _inputValue = "";

  @state()
  private _showNoResults = false;

  @state()
  private _selectedItem: SearchResultItem | null = null;

  @state()
  private _focusedItem: SearchResultItem | null = null;

  private _noResultElement = html`<div class="no-results">
    No results found
  </div>`;

  private _spinnerElement = html`<smart-spinner></smart-spinner>`;

  private _clearButtonElement = html`<smart-clear-button
    @clear=${this._handleClear}
  ></smart-clear-button>`;

  private _debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) {
      this._items = [];
      this._showNoResults = false;
      return;
    }
    this._isLoading = true;
    this._showNoResults = false;
    const results = await this.searchProvider(query);
    this._items = results.map(this.resultMapper);
    this._showNoResults = results.length === 0;
    this._isLoading = false;
  }, 300);

  private _handleInputChange(event: CustomEvent) {
    this._inputValue = event.detail.value;
    this._selectedItem = null;
    this._focusedItem = null;
    this._debouncedSearch(this._inputValue);
  }

  private _handleClear() {
    this._inputValue = "";
    this._items = [];
    this._showNoResults = false;
  }

  private _handleFocusIn() {
    this._debouncedSearch(this._inputValue);
  }

  private _handleItemSelected(selectedItem: SearchResultItem) {
    this._selectedItem = selectedItem;
    this._inputValue = this._selectedItem?.primaryText || "";
    this._items = [];
    this._showNoResults = false;
    this._focusedItem = null;
    this.dispatchEvent(
      new CustomEvent("search-item-selected", {
        detail: { item: this._selectedItem },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSubmit = (event: Event) => {
    event.preventDefault();
    if (this._focusedItem) {
      this._handleItemSelected(this._focusedItem);
    }
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    let currentIndex;
    console.log("Key down event:", event.key);
    switch (event.key) {
      case "ArrowDown":
        currentIndex = -1;
        if (this._focusedItem) {
          currentIndex = this._items.findIndex(
            (item) => item.id === this._focusedItem?.id
          );
        }
        if (currentIndex >= this._items.length - 1) {
          this._focusedItem = this._items[0];
        } else {
          this._focusedItem = this._items[currentIndex + 1];
        }
        break;
      case "ArrowUp":
        currentIndex = this._items.length;
        if (this._focusedItem) {
          currentIndex = this._items.findIndex(
            (item) => item.id === this._focusedItem?.id
          );
        }
        if (currentIndex === 0) {
          this._focusedItem = this._items[this._items.length - 1];
        } else {
          this._focusedItem = this._items[currentIndex - 1];
        }
        break;
      case "Enter":
        if (this._focusedItem) {
          this._handleItemSelected(this._focusedItem);
        }
        break;
      case "Escape":
        this._items = [];
        this._showNoResults = false;
        this._focusedItem = null;
        break;
      default:
        break;
    }
  };

  private _handleItemHovered = (event: CustomEvent) => {
    const targetItem = this._items.find(
      (item) => item.id === event.detail.itemId
    );
    if (targetItem) this._focusedItem = targetItem;
  };

  private _handleGlobalPointerDown = (event: PointerEvent) => {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this._items = [];
      this._showNoResults = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("pointerdown", this._handleGlobalPointerDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pointerdown", this._handleGlobalPointerDown);
  }

  protected render() {
    return html`
      <div>
        <form
          class="search-container"
          @keydown=${this._handleKeyDown}
          @submit=${this._handleSubmit}
        >
          <smart-input
            .value=${this._inputValue}
            @input-changed=${this._handleInputChange}
            @focus-in=${this._handleFocusIn}
            placeholder="Search..."
          ></smart-input>
          ${this._isLoading
            ? this._spinnerElement
            : this._inputValue.length > 0
              ? this._clearButtonElement
              : ""}
        </form>
        <smart-dropdown
          .focusedItemId=${this._focusedItem?.id}
          @item-selected=${(event: CustomEvent) =>
            this._handleItemSelected(event.detail.item)}
          @item-hovered=${this._handleItemHovered}
          .items=${this._items}
        ></smart-dropdown>
        ${this._showNoResults ? this._noResultElement : ""}
      </div>
    `;
  }
}
