import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import { SearchResultItem, SmartDropdown } from "./smart-dropdown.js";
import "./smart-dropdown.js"; // Import to register the component

describe("SmartDropdown", () => {
  const mockItems: SearchResultItem[] = [
    {
      id: "item-1",
      primaryText: "First Item",
      secondaryText: "Description 1",
      original: { data: "test1" },
    },
    {
      id: "item-2",
      primaryText: "Second Item",
      original: { data: "test2" },
    },
    {
      id: "item-3",
      primaryText: "Third Item",
      isDisabled: true,
      original: { data: "test3" },
    },
  ];

  describe("Rendering", () => {
    it("should render an empty list when no items provided", async () => {
      const el = await fixture<SmartDropdown>(
        html`<smart-dropdown></smart-dropdown>`
      );

      const listbox = el.shadowRoot!.querySelector('[role="listbox"]');
      expect(listbox).to.exist;

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options.length).to.equal(0);
    });

    it("should render all items", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options.length).to.equal(3);
    });

    it("should display primary text for each item", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options[0].textContent?.trim()).to.equal("First Item");
      expect(options[1].textContent?.trim()).to.equal("Second Item");
      expect(options[2].textContent?.trim()).to.equal("Third Item");
    });

    it("should apply correct item IDs", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options[0].id).to.equal("item-1");
      expect(options[1].id).to.equal("item-2");
      expect(options[2].id).to.equal("item-3");
    });
  });

  describe("Theme", () => {
    it("should have default theme as light", async () => {
      const el = await fixture<SmartDropdown>(
        html`<smart-dropdown></smart-dropdown>`
      );
      expect(el.theme).to.equal("light");
    });

    it("should reflect theme attribute", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown theme="dark"></smart-dropdown>
      `);
      expect(el.getAttribute("theme")).to.equal("dark");
    });
  });

  describe("Focus Management", () => {
    it("should apply selected class to focused item", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown
          .items=${mockItems}
          .focusedItemId=${"item-2"}
        ></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options[0].classList.contains("selected")).to.be.false;
      expect(options[1].classList.contains("selected")).to.be.true;
      expect(options[2].classList.contains("selected")).to.be.false;
    });

    it("should scroll focused item into view", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const focusedElement = el.shadowRoot!.querySelector(
        "#item-2"
      ) as HTMLElement;
      expect(focusedElement).to.exist;

      let scrollCalled = false;
      focusedElement.scrollIntoView = () => {
        scrollCalled = true;
      };

      el.focusedItemId = "item-2";
      await el.updateComplete;

      expect(scrollCalled).to.be.true;
    });
  });

  describe("User Interactions", () => {
    it("should dispatch item-selected event on click", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      setTimeout(() => {
        const option = el.shadowRoot!.querySelector(
          '[role="option"]'
        ) as HTMLElement;
        option.click();
      });

      const event = await oneEvent(el, "item-selected");
      expect(event.detail.item).to.deep.equal(mockItems[0]);
    });

    it("should dispatch item-hovered event on pointer over", async () => {
      const el = await fixture(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      setTimeout(() => {
        const option = el.shadowRoot!.querySelector("#item-2") as HTMLElement;
        option.dispatchEvent(
          new PointerEvent("pointerover", {
            bubbles: true,
            composed: true,
          })
        );
      });

      const event = await oneEvent(el, "item-hovered");
      expect(event.detail.itemId).to.equal("item-2");
    });

    it("should pass item data in event detail", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      setTimeout(() => {
        const options = el.shadowRoot!.querySelectorAll('[role="option"]');
        const option = options[1] as HTMLElement;
        option.click();
      });

      const event = await oneEvent(el, "item-selected");
      expect(event.detail.item.id).to.equal("item-2");
      expect(event.detail.item.primaryText).to.equal("Second Item");
    });
  });

  describe("Accessibility", () => {
    it("should have listbox role", async () => {
      const el = await fixture<SmartDropdown>(
        html`<smart-dropdown></smart-dropdown>`
      );

      const listbox = el.shadowRoot!.querySelector('[role="listbox"]');
      expect(listbox).to.exist;
    });

    it("should have option role for each item", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options.length).to.equal(3);
      options.forEach((option) => {
        expect(option.getAttribute("role")).to.equal("option");
      });
    });

    it("should set aria-selected to true for focused item", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown
          .items=${mockItems}
          .focusedItemId=${"item-2"}
        ></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options[0].getAttribute("aria-selected")).to.equal("false");
      expect(options[1].getAttribute("aria-selected")).to.equal("true");
      expect(options[2].getAttribute("aria-selected")).to.equal("false");
    });

    it("should set aria-selected to false for non-focused items", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      options.forEach((option) => {
        expect(option.getAttribute("aria-selected")).to.equal("false");
      });
    });

    it("should have unique IDs for each option", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems}></smart-dropdown>
      `);

      const options = el.shadowRoot!.querySelectorAll('[role="option"]');
      const ids = Array.from(options).map((opt) => opt.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).to.equal(uniqueIds.size);
      expect(ids.length).to.equal(3);
    });

    it("should pass axe accessibility tests", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown
          .items=${mockItems}
          .focusedItemId=${"item-1"}
        ></smart-dropdown>
      `);

      await expect(el).to.be.accessible();
    });

    it("should pass axe accessibility tests with empty items", async () => {
      const el = await fixture<SmartDropdown>(
        html`<smart-dropdown></smart-dropdown>`
      );
      await expect(el).to.be.accessible();
    });
  });

  describe("Dynamic Updates", () => {
    it("should update when items change", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown .items=${mockItems.slice(0, 2)}></smart-dropdown>
      `);

      let options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options.length).to.equal(2);

      el.items = mockItems;
      await el.updateComplete;

      options = el.shadowRoot!.querySelectorAll('[role="option"]');
      expect(options.length).to.equal(3);
    });

    it("should update aria-selected when focusedItemId changes", async () => {
      const el = await fixture<SmartDropdown>(html`
        <smart-dropdown
          .items=${mockItems}
          .focusedItemId=${"item-1"}
        ></smart-dropdown>
      `);

      let option = el.shadowRoot!.querySelector("#item-1");
      expect(option?.getAttribute("aria-selected")).to.equal("true");

      el.focusedItemId = "item-2";
      await el.updateComplete;

      option = el.shadowRoot!.querySelector("#item-1");
      expect(option?.getAttribute("aria-selected")).to.equal("false");

      option = el.shadowRoot!.querySelector("#item-2");
      expect(option?.getAttribute("aria-selected")).to.equal("true");
    });
  });
});
