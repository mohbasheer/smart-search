import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { baseInputStyles } from "./smart-input.style.js";

@customElement("smart-input")
export class SmartInput extends LitElement {
  /**
   * The placeholder text to display when the input is empty.
   */
  @property({ type: String })
  placeholder: string = "Search...";

  /**
   * The current value of the input.
   */
  @property({ type: String })
  value: string = "";

  /**
   * The maximum number of characters allowed in the input.
   */
  @property({ type: Number })
  maxlength?: number;

  /**
   * A string of characters to prevent from being entered.
   */
  @property({ type: String })
  exclude: string = "";

  /**
   * Whether the input is disabled.
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * ARIA role for the input.
   */
  @property({ type: String })
  role: "combobox" | "textbox" | "searchbox" = "searchbox";

  /**
   * ID of the element this input controls.
   */
  @property({ type: String, attribute: "aria-controls" })
  ariaControls: string | null = null;

  /**
   * Whether the controlled element is expanded.
   */
  @property({ type: String, attribute: "aria-expanded" })
  ariaExpanded: "true" | "false" | null = null;

  /**
   * ID of the currently active descendant.
   */
  @property({ type: String, attribute: "aria-activedescendant" })
  ariaActiveDescendant: string | null = null;

  @property({ type: String, reflect: true })
  theme: string = "light";

  @query("input")
  private _inputElement!: HTMLInputElement;

  static styles = [baseInputStyles];

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("input-changed", {
        detail: {
          value: input.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  //TODO: Implement exclude logic for copy and paste as well
  private _handleBeforeInput(event: InputEvent) {
    if (
      this.exclude !== "" &&
      event.data &&
      this.exclude.includes(event.data)
    ) {
      event.preventDefault();
    }
  }

  private _handleFocusIn() {
    this.dispatchEvent(
      new CustomEvent("focus-in", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocusOut() {
    this.dispatchEvent(
      new CustomEvent("focus-out", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this._inputElement.blur();
    }
  }

  protected render() {
    return html`
      <input
        id="smart-input"
        type="text"
        .value=${this.value}
        @keydown=${this._handleKeyDown}
        placeholder=${ifDefined(this.placeholder)}
        maxlength=${ifDefined(this.maxlength)}
        ?disabled=${this.disabled}
        role=${this.role}
        aria-controls=${ifDefined(this.ariaControls ?? undefined)}
        aria-expanded=${ifDefined(this.ariaExpanded ?? undefined)}
        aria-activedescendant=${ifDefined(
          this.ariaActiveDescendant ?? undefined
        )}
        @input=${this._handleInput}
        @beforeinput=${this._handleBeforeInput}
        @focus=${this._handleFocusIn}
        @blur=${this._handleFocusOut}
      />
    `;
  }
}
