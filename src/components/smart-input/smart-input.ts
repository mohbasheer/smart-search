import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
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

  protected render() {
    return html`
      <input
        id="smart-input"
        maxlength=${ifDefined(this.maxlength)}
        type="text"
        value=${this.value}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this._handleInput}
        @beforeinput=${this._handleBeforeInput}
        @focus=${this._handleFocusIn}
        @blur=${this._handleFocusOut}
      />
    `;
  }
}
