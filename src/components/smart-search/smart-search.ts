import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { debounce } from "../../utils/debounce.js";
import { styles } from "./smart-search.styles.js";

import "../smart-dropdown/smart-dropdown.js";
import "../smart-input/smart-input.js";
import "../smart-spinner/smart-spinner.js";
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
  private _query = "";

  @state()
  private _showNoResults = false;

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
    this._showNoResults = results.length === 0 && query.length >= 2;
    this._isLoading = false;
  }, 300);

  private _handleInputChange(event: CustomEvent) {
    this._query = event.detail.value;
    this._debouncedSearch(this._query);
  }

  private _handleFocusIn() {
    this._debouncedSearch(this._query);
  }

  private _handleFocusOut() {
    this._items = [];
    this._showNoResults = false;
  }

  protected render() {
    return html`
      <div>
        <div class="search-container">
          <smart-input
            @input-changed=${this._handleInputChange}
            @focus-out=${this._handleFocusOut}
            @focus-in=${this._handleFocusIn}
            placeholder="Search..."
          >
          </smart-input>
          ${this._isLoading ? html`<smart-spinner></smart-spinner>` : ""}
        </div>
        <smart-dropdown .items=${this._items}></smart-dropdown>
        ${this._showNoResults
          ? html`<div class="no-results">No results found</div>`
          : ""}
      </div>
    `;
  }
}
