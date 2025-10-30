import { html, LitElement, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";
import "../index";
import { queryCustomers } from "../mockAPI";
import { Customer } from "../mockAPI/data/customers";
import { SearchResultItem } from "../index";
import { FilterConfig } from "../components/smart-filter/type";

@customElement("demo-page")
export class DemoPage extends LitElement {
  @state()
  private _selectedItem1: SearchResultItem<Customer> | null = null;

  @state()
  private _selectedItem2: SearchResultItem<Customer> | null = null;

  @query("dialog")
  private _dialog!: HTMLDialogElement;

  private resultMapper = (data: Customer): SearchResultItem => ({
    id: data.customerId,
    primaryText: data.name,
    original: data,
  });

  private _handleItemSelected1(event: CustomEvent) {
    this._selectedItem1 = event.detail.item;
  }

  private _handleItemSelected2(event: CustomEvent) {
    this._selectedItem2 = event.detail.item;
  }

  private _openDialog() {
    this._dialog.showModal();
  }

  private _closeDialog() {
    this._selectedItem2 = null;
  }

  private _filterConfig: FilterConfig[] = [
    {
      filterId: "email_filter",
      label: "hasValidEmail",
      componentType: "checkbox",
      handler: (
        items: SearchResultItem<Customer>[],
        filterValue: boolean | string
      ) => {
        if (filterValue === false) {
          return items;
        }
        return items.filter(
          (item) => item.original.email && item.original.email.length > 0
        );
      },
    } as FilterConfig,
    {
      filterId: "priority_customer",
      label: "priorityCustomer",
      componentType: "dropdown",
      options: [
        { value: "All", label: "All Customers" },
        { value: "cust-101", label: "Ricardo Montero" },
        { value: "cust-106", label: "Ramsey Bolton" },
        { value: "cust-108", label: "Enrico Pallazzo" },
      ],
      handler: (
        items: SearchResultItem<Customer>[],
        filterValue: boolean | string
      ) => {
        if (!filterValue || filterValue === "All") {
          return items;
        }
        return items.filter((item) => item.original.customerId === filterValue);
      },
    } as FilterConfig,
  ];

  private _renderCustomerDetails(item: SearchResultItem<Customer> | null) {
    if (!item) {
      return html`<p class="no-selection">No item selected.</p>`;
    }

    const customer = item.original;
    return html`
      <div class="details-container">
        <h4>Selected Customer Details</h4>
        <p><strong>ID:</strong> ${customer.customerId}</p>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Member Since:</strong> ${customer.memberSince}</p>
      </div>
    `;
  }

  render() {
    return html`
      <h1>Smart Search Component Demo</h1>
      <div class="demo-section">
        <h2>Basic Search Input</h2>
        <smart-search
          exclude="@#$%^&*()!"
          .searchProvider=${queryCustomers}
          .resultMapper=${this.resultMapper}
          @search-item-selected=${this._handleItemSelected1}
          .filterConfig=${this._filterConfig}
          id="smart-search"
          theme="light"
        ></smart-search>
        ${this._renderCustomerDetails(this._selectedItem1)}
      </div>

      <div class="demo-section">
        <h2>Search in a Dialog</h2>
        <button @click=${this._openDialog}>Open Search Dialog</button>
        <dialog @close=${this._closeDialog}>
          <h3>Search Customers</h3>
          <smart-search
            theme="light"
            .filterConfig=${this._filterConfig}
            .searchProvider=${queryCustomers}
            .resultMapper=${this.resultMapper}
            @search-item-selected=${this._handleItemSelected2}
          ></smart-search>
          ${this._renderCustomerDetails(this._selectedItem2)}
          <form method="dialog">
            <button class="close-button">Close</button>
          </form>
        </dialog>
      </div>
    `;
  }

  static styles = css`
    dialog {
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 2rem;
      width: 80%;
      max-width: 500px;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .close-button {
      margin-top: 1rem;
    }

    .details-container {
      margin-top: 1.5rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .details-container h4 {
      margin-top: 0;
    }

    .no-selection {
      margin-top: 1.5rem;
      color: #888;
    }
  `;
}
