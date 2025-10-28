import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { debounce } from "../../utils/debounce.js";
import { styles } from "./smart-search.styles.js";
import { theme } from "./themes.js";
import { nanoid } from "nanoid";

import "../smart-dropdown/smart-dropdown.js";
import "../smart-input/smart-input.js";
import "../smart-spinner/smart-spinner.js";
import "../smart-clear-button/smart-clear-button.js";
import { SearchResultItem } from "../smart-dropdown/smart-dropdown.js";
import { FloatingUIController } from "./floating-ui-controller.js";

type SearchProvider = (query: string) => Promise<any[]>;

@customElement("smart-search")
export class SmartSearch extends LitElement {
  static styles = [theme, styles];

  @property({ type: String, reflect: true })
  theme: string = "light";

  @query("smart-input")
  private _inputElement!: HTMLElement;

  @query("smart-dropdown")
  private _dropdownElement!: HTMLElement;

  private _listboxId: string;
  private _floatingController: FloatingUIController;

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

  @state()
  private _errorMessage: string | null = null;

  private _noResultElement = html`<div
    class="no-results"
    role="status"
    aria-live="polite"
  >
    No results found
  </div>`;

  private _spinnerElement = html`<smart-spinner></smart-spinner>`;
  private _clearButtonElement = html`<smart-clear-button
    @clear=${this._handleClear}
  ></smart-clear-button>`;

  constructor() {
    super();
    this._listboxId = `smart-dropdown-listbox-${nanoid(6)}`;
    this._floatingController = new FloatingUIController(this);
  }

  private _debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) {
      this._items = [];
      this._showNoResults = false;
      return;
    }
    this._isLoading = true;
    this._showNoResults = false;
    this._errorMessage = null;
    try {
      const results = await this.searchProvider(query);
      this._items = results.map(this.resultMapper);
      this._showNoResults = results.length === 0;
    } catch (error) {
      this._errorMessage = "An error occurred while searching.";
      console.error("Search failed:", error);
    } finally {
      this._isLoading = false;
    }
  }, 300);

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("_items") && this._items.length > 0) {
      this._floatingController.setElements(
        this._inputElement,
        this._dropdownElement
      );
      this._floatingController.updatePosition();
    }
  }

  private _hideDropdown() {
    this._items = [];
    this._showNoResults = false;
    this._floatingController.clear();
  }

  private _handleInputChange(event: CustomEvent) {
    this._inputValue = event.detail.value;
    this._selectedItem = null;
    this._focusedItem = null;
    this._errorMessage = null;
    this._debouncedSearch(this._inputValue);
  }

  private _handleClear() {
    this._inputValue = "";
    this._hideDropdown();
  }

  private _handleFocusIn() {
    this._debouncedSearch(this._inputValue);
  }

  private _handleItemSelected(selectedItem: SearchResultItem) {
    this._selectedItem = selectedItem;
    this._inputValue = this._selectedItem?.primaryText || "";
    this._hideDropdown();
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
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
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
        event.preventDefault();
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
        this._hideDropdown();
        this._focusedItem = null;
        break;
      case "Tab":
        this._hideDropdown();
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
      this._hideDropdown();
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
    const isExpanded = this._items.length > 0;
    return html`
      <div style="position: relative;">
        <form
          class="search-container"
          @keydown=${this._handleKeyDown}
          @submit=${this._handleSubmit}
        >
          <smart-input
            theme=${this.theme}
            .value=${this._inputValue}
            @input-changed=${this._handleInputChange}
            @focus-in=${this._handleFocusIn}
            placeholder="Search..."
            role="combobox"
            .ariaControls=${this._listboxId}
            .ariaExpanded=${isExpanded ? "true" : "false"}
            .ariaActiveDescendant=${this._focusedItem?.id || null}
          ></smart-input>
          ${this._isLoading
            ? this._spinnerElement
            : this._inputValue.length > 0
              ? this._clearButtonElement
              : ""}
        </form>
        ${this._items.length > 0
          ? html`<smart-dropdown
              id=${this._listboxId}
              .focusedItemId=${this._focusedItem?.id}
              @item-selected=${(event: CustomEvent) =>
                this._handleItemSelected(event.detail.item)}
              @item-hovered=${this._handleItemHovered}
              .items=${this._items}
            ></smart-dropdown>`
          : ""}
        ${this._showNoResults ? this._noResultElement : ""}
        ${this._errorMessage
          ? html`<div class="error-message" role="alert" aria-live="assertive">
              ${this._errorMessage}
            </div>`
          : ""}
      </div>
    `;
  }
}
