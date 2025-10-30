import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export class BaseComponent extends LitElement {
  @property({ type: String, reflect: true })
  theme: string = "light";
}
