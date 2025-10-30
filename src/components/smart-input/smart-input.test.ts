import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "./smart-input.js";
import { SmartInput } from "./smart-input.js";

describe("SmartInput", () => {
  describe("Rendering", () => {
    it("should render with default properties", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input");

      expect(input).to.exist;
      expect(input?.placeholder).to.equal("Search...");
      expect(input?.value).to.equal("");
      expect(input?.disabled).to.be.false;
    });

    it("should render with custom placeholder", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input placeholder="Enter text..."></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.placeholder).to.equal("Enter text...");
    });

    it("should render with initial value", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input value="test value"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.value).to.equal("test value");
    });

    it("should render with maxlength attribute", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input maxlength="10"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.maxLength).to.equal(10);
    });

    it("should render as disabled", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input disabled></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.disabled).to.be.true;
    });
  });

  describe("Input Behavior", () => {
    it("should emit input-changed event on input", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input")!;

      setTimeout(() => {
        input.value = "test";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      const { detail } = await oneEvent(el, "input-changed");
      expect(detail.value).to.equal("test");
    });

    it("should prevent excluded characters from being entered", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input exclude="123"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input")!;

      const beforeInputEvent = new InputEvent("beforeinput", {
        data: "1",
        bubbles: true,
        cancelable: true,
      });

      let preventedCalled = false;
      const originalPreventDefault = beforeInputEvent.preventDefault;
      beforeInputEvent.preventDefault = function () {
        preventedCalled = true;
        originalPreventDefault.call(this);
      };

      input.dispatchEvent(beforeInputEvent);
      expect(preventedCalled).to.be.true;
      expect(beforeInputEvent.defaultPrevented).to.be.true;
    });

    it("should allow non-excluded characters", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input exclude="123"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input")!;

      const beforeInputEvent = new InputEvent("beforeinput", {
        data: "a",
        bubbles: true,
        cancelable: true,
      });

      input.dispatchEvent(beforeInputEvent);
      expect(beforeInputEvent.defaultPrevented).to.be.false;
    });
  });

  describe("Focus Events", () => {
    it("should emit focus-in event on focus", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input value="test"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input")!;

      setTimeout(() => input.focus());

      const { detail } = await oneEvent(el, "focus-in");
      expect(detail.value).to.equal("test");
    });

    it("should emit focus-out event on blur", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input value="test"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input")!;

      input.focus();
      setTimeout(() => input.blur());

      const { detail } = await oneEvent(el, "focus-out");
      expect(detail.value).to.equal("test");
    });

    it("should blur input on Escape key", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input")!;

      input.focus();
      expect(el.shadowRoot!.activeElement).to.equal(input);

      await sendKeys({ press: "Escape" });
      expect(el.shadowRoot!.activeElement).to.not.equal(input);
    });
  });

  describe("Accessibility", () => {
    it("should have default searchbox role", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.getAttribute("role")).to.equal("searchbox");
    });

    it("should support custom role", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input role="textbox"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.getAttribute("role")).to.equal("textbox");
    });

    it("should set aria-controls attribute", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input aria-controls="listbox-1"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.getAttribute("aria-controls")).to.equal("listbox-1");
    });

    it("should not set aria-controls when null", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.hasAttribute("aria-controls")).to.be.false;
    });

    it("should set aria-activedescendant attribute", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input aria-activedescendant="option-1"></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.getAttribute("aria-activedescendant")).to.equal("option-1");
    });

    it("should be screen reader accessible with proper semantics", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input
          role="combobox"
          aria-controls="listbox"
          aria-expanded="true"
        ></smart-input>`
      );
      const input = el.shadowRoot!.querySelector("input");

      expect(input?.getAttribute("role")).to.equal("combobox");
      expect(input?.getAttribute("aria-controls")).to.equal("listbox");
      expect(input?.getAttribute("aria-expanded")).to.equal("true");
    });

    it("should pass automated accessibility audit", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      await expect(el).to.be.accessible();
    });

    it("should be accessible when disabled", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input disabled></smart-input>`
      );
      await expect(el).to.be.accessible();
    });
  });

  describe("Theme", () => {
    it("should have default light theme", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);

      expect(el.theme).to.equal("light");
      expect(el.getAttribute("theme")).to.equal("light");
    });

    it("should support custom theme", async () => {
      const el = await fixture<SmartInput>(
        html`<smart-input theme="dark"></smart-input>`
      );

      expect(el.theme).to.equal("dark");
      expect(el.getAttribute("theme")).to.equal("dark");
    });
  });

  describe("Property Updates", () => {
    it("should update input when value property changes", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input")!;

      el.value = "updated";
      await el.updateComplete;

      expect(input.value).to.equal("updated");
    });

    it("should update input when disabled property changes", async () => {
      const el = await fixture<SmartInput>(html`<smart-input></smart-input>`);
      const input = el.shadowRoot!.querySelector("input")!;

      el.disabled = true;
      await el.updateComplete;

      expect(input.disabled).to.be.true;
    });
  });
});
