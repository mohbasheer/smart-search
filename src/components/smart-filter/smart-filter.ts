import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./smart-filter.style.js";

@customElement("smart-filter-bar")
export class SmartFilterBar extends LitElement {
  static styles = [styles];
  @property({ type: Boolean })
  hasEmail = false;

  @property({ type: String })
  joinedBefore = "";

  private _handleEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.hasEmail = target.checked;
    this.dispatchEvent(
      new CustomEvent("filters-changed", {
        detail: { hasEmail: this.hasEmail, joinedBefore: this.joinedBefore },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.joinedBefore = target.value;
    this.dispatchEvent(
      new CustomEvent("filters-changed", {
        detail: { hasEmail: this.hasEmail, joinedBefore: this.joinedBefore },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(event: KeyboardEvent) {
    // Allow keyboard navigation within the filter bar
    // but don't prevent default to maintain normal form behavior
    if (event.key === "Enter" || event.key === " ") {
      // Let the inputs handle their own events
      return;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  render() {
    return html`
      <div class="filter-bar" role="group" aria-label="Search filters">
        <div class="filter-header">
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-controls">
          <div class="filter-item">
            <label class="filter-label" for="hasEmail">
              <input
                type="checkbox"
                .checked=${this.hasEmail}
                @change=${this._handleEmailChange}
                id="hasEmail"
                aria-describedby="hasEmail-desc"
              />
              <span class="checkmark" aria-hidden="true"></span>
              Has Email
            </label>
            <span id="hasEmail-desc" class="sr-only">
              Filter results to show only customers with valid email addresses
            </span>
          </div>
          <div class="filter-item">
            <label class="filter-label" for="joinedBefore">
              Joined Before
              <input
                type="date"
                .value=${this.joinedBefore}
                @change=${this._handleDateChange}
                id="joinedBefore"
                class="date-input"
                aria-describedby="joinedBefore-desc"
              />
            </label>
            <span id="joinedBefore-desc" class="sr-only">
              Filter results to show customers who joined before the selected
              date
            </span>
          </div>
        </div>
      </div>
    `;
  }
}
