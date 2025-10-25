import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { debounce } from "../../utils/debounce.js";

import "../smart-dropdown/smart-dropdown.js";
import "../smart-input/smart-input.js";
import { SearchResultItem } from "../smart-dropdown/smart-dropdown.js";

type SearchProvider = (query: string) => Promise<any[]>;

@customElement("smart-search")
export class SmartSearch extends LitElement {
  @property({ attribute: false })
  searchProvider: SearchProvider = async () => [];

  @property({ attribute: false })
  resultMapper: (item: any) => SearchResultItem = (item: any) => item;

  @state()
  private _items: SearchResultItem[] = [];

  private _debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) {
      this._items = [];
      return;
    }
    //TODO: We will add a loading state here later
    const results = await this.searchProvider(query);
    this._items = results.map(this.resultMapper);
  }, 300);

  private _handleInputChange(event: CustomEvent) {
    this._debouncedSearch(event.detail.value);
  }

  protected render() {
    return html`
      <div>
        <smart-input
          @input-changed=${this._handleInputChange}
          placeholder="Search..."
        >
        </smart-input>
        <smart-dropdown .items=${this._items}></smart-dropdown>
      </div>
    `;
  }
}
