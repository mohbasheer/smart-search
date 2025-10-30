import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "./smart-clear-button.js";
import { SmartClearButton } from "./smart-clear-button.js";

describe("SmartClearButton", () => {
  describe("Rendering", () => {
    it("should render a button element", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      const button = el.shadowRoot!.querySelector("button");
      expect(button).to.exist;
    });

    it("should render SVG icon", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      const svg = el.shadowRoot!.querySelector("svg");
      expect(svg).to.exist;
      expect(svg?.getAttribute("viewBox")).to.equal("0 0 24 24");
    });

    it("should render X icon with two lines", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      const lines = el.shadowRoot!.querySelectorAll("line");
      expect(lines.length).to.equal(2);

      // Check first line (top-left to bottom-right)
      expect(lines[0].getAttribute("x1")).to.equal("18");
      expect(lines[0].getAttribute("y1")).to.equal("6");
      expect(lines[0].getAttribute("x2")).to.equal("6");
      expect(lines[0].getAttribute("y2")).to.equal("18");

      // Check second line (bottom-left to top-right)
      expect(lines[1].getAttribute("x1")).to.equal("6");
      expect(lines[1].getAttribute("y1")).to.equal("6");
      expect(lines[1].getAttribute("x2")).to.equal("18");
      expect(lines[1].getAttribute("y2")).to.equal("18");
    });
  });

  describe("Theme", () => {
    it("should have default theme as light", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );
      expect(el.theme).to.equal("light");
    });

    it("should reflect theme attribute", async () => {
      const el = await fixture<SmartClearButton>(html`
        <smart-clear-button theme="dark"></smart-clear-button>
      `);
      expect(el.getAttribute("theme")).to.equal("dark");
    });

    it("should update theme dynamically", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      el.theme = "dark";
      await el.updateComplete;

      expect(el.getAttribute("theme")).to.equal("dark");
    });
  });

  describe("User Interactions", () => {
    it("should dispatch clear event on button click", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      setTimeout(() => {
        const button = el.shadowRoot!.querySelector(
          "button"
        ) as HTMLButtonElement;
        button.click();
      });

      const event = await oneEvent(el, "clear");
      expect(event).to.exist;
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on button", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      const button = el.shadowRoot!.querySelector("button");
      expect(button?.getAttribute("aria-label")).to.equal("Clear input");
    });

    it("should pass axe accessibility tests", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );
      await expect(el).to.be.accessible();
    });

    it("should pass axe accessibility tests with dark theme", async () => {
      const el = await fixture<SmartClearButton>(html`
        <smart-clear-button theme="dark"></smart-clear-button>
      `);
      await expect(el).to.be.accessible();
    });
  });

  describe("Button State", () => {
    it("should not be disabled by default", async () => {
      const el = await fixture<SmartClearButton>(
        html`<smart-clear-button></smart-clear-button>`
      );

      const button = el.shadowRoot!.querySelector(
        "button"
      ) as HTMLButtonElement;
      expect(button.disabled).to.be.false;
    });
  });
});
