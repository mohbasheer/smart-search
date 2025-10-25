import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../index";
import { queryCustomers } from "../mockAPI";
import { Customer } from "../mockAPI/data/customers";
import { SearchResultItem } from "../index";

@customElement("demo-page")
export class DemoPage extends LitElement {
  private resultMapper = (data: Customer): SearchResultItem => ({
    id: data.customerId,
    primaryText: data.name,
    original: data,
  });

  render() {
    return html`
      <h1>Smart Search Component Demo</h1>
      <div class="demo-section">
        <h2>Basic Search Input</h2>
        <smart-search
          .searchProvider=${queryCustomers}
          .resultMapper=${this.resultMapper}
          id="smart-search"
        ></smart-search>
      </div>
    `;
  }
}
