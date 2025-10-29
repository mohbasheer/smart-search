import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { css } from "lit";

@customElement("smart-filter-bar")
export class SmartFilterBar extends LitElement {
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

  static styles = css`
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px 8px 16px;
      background-color: transparent;
      position: relative;
      font-family: inherit;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 0;
    }

    .filter-header {
      color: var(--smart-search-font-color, #111111);
      font-weight: 500;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
      opacity: 0.7;
    }

    .filter-title {
      color: var(--smart-search-font-color, #111111);
    }

    .filter-controls {
      display: flex;
      gap: 20px;
      align-items: center;
      flex: 1;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 120px;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 400;
      color: var(--smart-search-font-color, #111111);
      cursor: pointer;
      position: relative;
      font-family: inherit;
      opacity: 0.8;
    }

    .filter-label:focus-within {
      outline: 2px solid var(--smart-search-font-color, #111111);
      outline-offset: 2px;
      border-radius: 4px;
      opacity: 1;
    }

    /* Screen reader only text */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Custom checkbox styling */
    .checkmark {
      position: relative;
      width: 16px;
      height: 16px;
      background: var(--smart-search-background-color, #ffffff);
      border: 1px solid var(--smart-search-border-color, #e6e6e6);
      border-radius: 3px;
      transition: all 0.2s ease;
    }

    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    input[type="checkbox"]:focus + .checkmark {
      outline: 2px solid var(--smart-search-font-color, #111111);
      outline-offset: 2px;
    }

    input[type="checkbox"]:checked ~ .checkmark {
      background: var(--smart-search-font-color, #111111);
      border-color: var(--smart-search-font-color, #111111);
    }

    .checkmark::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid var(--smart-search-background-color, #ffffff);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    input[type="checkbox"]:checked ~ .checkmark::after {
      opacity: 1;
    }

    /* Date input styling */
    .date-input {
      padding: 8px 12px;
      border: 1px solid var(--smart-search-border-color, #e6e6e6);
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      background: var(--smart-search-background-color, #ffffff);
      color: var(--smart-search-font-color, #111111);
      transition: all 0.2s ease;
      min-width: 120px;
      box-sizing: border-box;
    }

    .date-input:focus {
      outline: none;
      border-color: var(--smart-search-font-color, #111111);
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }

    .date-input:hover {
      border-color: var(--smart-search-font-color, #111111);
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .filter-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 12px;
      }

      .filter-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
      }

      .filter-item {
        min-width: unset;
        width: 100%;
      }
    }
  `;
}
