import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { nanoid } from "nanoid/non-secure";
import { debounce } from "../../utils/debounce.js";
import { styles } from "./smart-search.styles.js";
import { theme } from "./themes.js";

import "../smart-clear-button/smart-clear-button.js";
import "../smart-dropdown/smart-dropdown.js";
import { SearchResultItem } from "../smart-dropdown/smart-dropdown.js";
import "../smart-filter/smart-filter.js";
import { FilterConfig } from "../smart-filter/type.js";
import "../smart-input/smart-input.js";
import "../smart-spinner/smart-spinner.js";
import { FloatingUIController } from "./floating-ui-controller.js";

type SearchProvider = (query: string) => Promise<any[]>;
interface FilterState {
  filterId: string;
  value: string | boolean;
}

@customElement("smart-search")
export class SmartSearch extends LitElement {
  static styles = [theme, styles];
  private _listboxId: string;
  private _floatingController: FloatingUIController;

  @query("smart-input")
  private _inputElement!: HTMLElement;

  @query("smart-dropdown")
  private _dropdownElement!: HTMLElement;

  @property({ type: String, reflect: true })
  theme: string = "light";

  @property({ attribute: false })
  searchProvider: SearchProvider = async () => [];

  @property({ attribute: false })
  resultMapper: (item: any) => SearchResultItem = (item: any) => item;

  /**
   * A string of characters to prevent from being entered.
   */
  @property({ type: String })
  exclude: string = "";

  private _searchResultCache: SearchResultItem[] = [];

  @state()
  private _searchResultInternal: SearchResultItem[] = [];

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

  @state()
  private _filterState: FilterState[] = [];

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

  private get _searchResult() {
    return this._searchResultInternal;
  }

  private set _searchResult(value: SearchResultItem[]) {
    this._searchResultInternal = this._applyFilters(value);
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("filterConfig")) {
      /**
       * update filter state when config changes
       */
      this._filterState = this.filterConfig.map((config) => ({
        filterId: config.filterId,
        value:
          config.defaultValue ||
          (config.componentType === "checkbox" ? false : ""),
      }));
    }
  }

  private _applyFilters(items: SearchResultItem[]): SearchResultItem[] {
    let filtered = items;

    this._filterState.forEach((fState) => {
      const config = this.filterConfig.find(
        (config) => config.filterId === fState.filterId
      );
      if (config && config.handler) {
        filtered = config.handler(filtered, fState.value);
      }
    });

    return filtered;
  }

  private _clearResult = () => {
    this._searchResult = [];
    this._searchResultCache = [];
  };

  private _debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) {
      this._clearResult();
      this._showNoResults = false;
      return;
    }
    this._isLoading = true;
    this._showNoResults = false;
    this._errorMessage = null;
    try {
      const results = await this.searchProvider(query);
      this._searchResultCache = results.map(this.resultMapper);
      this._searchResult = this._searchResultCache;
      this._showNoResults = this._searchResult.length === 0;
    } catch (error) {
      this._errorMessage = "An error occurred while searching.";
      console.error("Search failed:", error);
    } finally {
      this._isLoading = false;
    }
  }, 300);

  updated(changedProperties: Map<string | symbol, unknown>) {
    if (
      changedProperties.has("_searchResultInternal") &&
      this._searchResult.length > 0
    ) {
      this._floatingController.setElements(
        this._inputElement,
        this._dropdownElement
      );
      this._floatingController.updatePosition();
    }
  }

  private _hideDropdown() {
    this._clearResult();
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
          currentIndex = this._searchResult.findIndex(
            (item) => item.id === this._focusedItem?.id
          );
        }
        if (currentIndex >= this._searchResult.length - 1) {
          this._focusedItem = this._searchResult[0];
        } else {
          this._focusedItem = this._searchResult[currentIndex + 1];
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        currentIndex = this._searchResult.length;
        if (this._focusedItem) {
          currentIndex = this._searchResult.findIndex(
            (item) => item.id === this._focusedItem?.id
          );
        }
        if (currentIndex === 0) {
          this._focusedItem = this._searchResult[this._searchResult.length - 1];
        } else {
          this._focusedItem = this._searchResult[currentIndex - 1];
        }
        break;
      case "Enter":
        if (this._focusedItem) {
          this._handleItemSelected(this._focusedItem);
        }
        break;
      case "Escape":
        event.preventDefault();
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
    const targetItem = this._searchResult.find(
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

  private _handleFilterChange = (event: CustomEvent) => {
    const { filterId, value } = event.detail;

    const config = this.filterConfig.find(
      (config) => config.filterId === filterId
    );

    if (!config) return;
    this._filterState = [
      ...this._filterState.map((fState) =>
        fState.filterId === filterId ? { ...fState, value } : fState
      ),
    ];

    /**
     * should have values in cache to apply filter
     */
    if (this._searchResultCache.length === 0) return;

    if (config.handler) {
      this._searchResult = config.handler(this._searchResultCache, value);
    }

    this._showNoResults = this._searchResult.length === 0;
  };

  @property({ attribute: false })
  filterConfig: FilterConfig[] = [];

  protected render() {
    const isExpanded = this._searchResult.length > 0;
    return html`
      <div class="search-container">
        <form @keydown=${this._handleKeyDown} @submit=${this._handleSubmit}>
          <smart-filter
            .config=${this.filterConfig}
            @filter-applied=${this._handleFilterChange}
          ></smart-filter>
          <div class="input-wrapper">
            <smart-input
              theme=${this.theme}
              .exclude=${this.exclude}
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
          </div>
        </form>
        ${this._searchResult.length > 0
          ? html`<smart-dropdown
              id=${this._listboxId}
              .focusedItemId=${this._focusedItem?.id}
              @item-selected=${(event: CustomEvent) =>
                this._handleItemSelected(event.detail.item)}
              @item-hovered=${this._handleItemHovered}
              .items=${this._searchResult}
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
