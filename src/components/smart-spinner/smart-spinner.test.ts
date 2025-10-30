import { html, fixture, expect } from "@open-wc/testing";
import "./smart-spinner.js";
import { SmartSpinner } from "./smart-spinner.js";

describe("smart-spinner", () => {
  it("renders a spinner element in the shadow DOM", async () => {
    const el = await fixture<SmartSpinner>(
      html`<smart-spinner></smart-spinner>`
    );
    const spinner = el.shadowRoot?.querySelector(".spinner");
    expect(spinner, "spinner element exists").to.exist;
  });
});
