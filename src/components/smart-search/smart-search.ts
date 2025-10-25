import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../smart-input/smart-input.js";
import "../smart-dropdown/smart-dropdown.js";
import { DropdownItem } from "../smart-dropdown/smart-dropdown.js";

@customElement("smart-search")
export class SmartSearch extends LitElement {
  private initialValue = [
    { id: "1", text: "mohammed" },
    { id: "2", text: "basheer" },
    { id: "3", text: "basha" },
    { id: "4", text: "ravi" },
    { id: "5", text: "john" },
  ];

  @state()
  private items: DropdownItem[] = [];

  private _handleInputChange(event: CustomEvent) {
    if (event.detail.value === "") return;
    this.items = this.initialValue.filter(({ text }) =>
      text.includes(event.detail.value)
    );
  }

  protected render() {
    return html`
      <div>
        <smart-input
          @input-changed=${this._handleInputChange}
          exclude="@!$%"
          value="checking 123"
          id="basic-search"
        >
        </smart-input>
        <smart-dropdown .items=${this.items}></smart-dropdown>
      </div>
    `;
  }
}
