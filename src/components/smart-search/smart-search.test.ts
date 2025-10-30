import { expect, fixture, html, waitUntil, oneEvent } from "@open-wc/testing";
import { SmartSearch } from "./smart-search.js";
import { SearchResultItem } from "../smart-dropdown/smart-dropdown.js";

import "./smart-search.js";

describe("SmartSearch - Accessibility", () => {
  let element: SmartSearch;
  const mockResults: SearchResultItem[] = [
    { id: "1", primaryText: "Apple", secondaryText: "Fruit", original: {} },
    { id: "2", primaryText: "Banana", secondaryText: "Fruit", original: {} },
    {
      id: "3",
      primaryText: "Carrot",
      secondaryText: "Vegetable",
      original: {},
    },
  ];

  beforeEach(async () => {
    element = await fixture<SmartSearch>(html`<smart-search></smart-search>`);
  });

  describe("ARIA Attributes", () => {
    it("should have proper combobox role on input", async () => {
      const input = element.shadowRoot?.querySelector("smart-input");
      expect(input?.getAttribute("role")).to.equal("combobox");
    });

    it("should have aria-expanded=false when dropdown is closed", async () => {
      const input = element.shadowRoot?.querySelector("smart-input");
      expect(input?.ariaExpanded).to.equal("false");
    });

    it("should have aria-expanded=true when dropdown is open", async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "app" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );

      expect(input?.ariaExpanded).to.equal("true");
    });

    it("should have aria-controls pointing to listbox", async () => {
      const input = element.shadowRoot?.querySelector("smart-input") as any;
      const ariaControls = input?.ariaControls;

      expect(ariaControls).to.match(/^smart-dropdown-listbox-/);
    });

    it("should update aria-activedescendant when item is focused", async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "app" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );

      // Simulate ArrowDown key
      const form = element.shadowRoot?.querySelector("form");
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );

      await element.updateComplete;

      expect(input?.ariaActiveDescendant).to.equal("1");
    });

    it("should clear aria-activedescendant when no item is focused", async () => {
      const input = element.shadowRoot?.querySelector("smart-input") as any;
      expect(input?.ariaActiveDescendant).to.be.null;
    });
  });

  describe("Keyboard Navigation", () => {
    beforeEach(async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );
    });

    it("should navigate down through items with ArrowDown", async () => {
      const form = element.shadowRoot?.querySelector("form");
      const input = element.shadowRoot?.querySelector("smart-input") as any;

      // Press ArrowDown once
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );
      await element.updateComplete;
      expect(input?.ariaActiveDescendant).to.equal("1");

      // Press ArrowDown again
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );
      await element.updateComplete;
      expect(input?.ariaActiveDescendant).to.equal("2");
    });

    it("should navigate up through items with ArrowUp", async () => {
      const form = element.shadowRoot?.querySelector("form");
      const input = element.shadowRoot?.querySelector("smart-input") as any;

      // Press ArrowUp to go to last item
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      );
      await element.updateComplete;
      expect(input?.ariaActiveDescendant).to.equal("3");

      // Press ArrowUp again
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      );
      await element.updateComplete;
      expect(input?.ariaActiveDescendant).to.equal("2");
    });

    it("should select focused item on Enter key", async () => {
      const form = element.shadowRoot?.querySelector("form");

      // Focus first item
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );
      await element.updateComplete;

      // Listen for selection event
      const listener = oneEvent(element, "search-item-selected");

      // Press Enter
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );

      const event = await listener;
      expect(event.detail.item.id).to.equal("1");
    });

    it("should close dropdown on Escape key", async () => {
      const form = element.shadowRoot?.querySelector("form");

      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector("smart-dropdown");
      expect(dropdown).to.be.null;
    });

    it("should close dropdown on Tab key", async () => {
      const form = element.shadowRoot?.querySelector("form");

      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true })
      );
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector("smart-dropdown");
      expect(dropdown).to.be.null;
    });
  });

  describe("Screen Reader Support", () => {
    it("should announce no results with proper ARIA live region", async () => {
      element.searchProvider = async () => [];

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "xyz" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector(".no-results") !== null,
        "No results message should appear",
        { timeout: 2000 }
      );

      const noResults = element.shadowRoot?.querySelector(".no-results");
      expect(noResults?.getAttribute("role")).to.equal("status");
      expect(noResults?.getAttribute("aria-live")).to.equal("polite");
      expect(noResults?.textContent?.trim()).to.equal("No results found");
    });

    it("should announce errors with assertive aria-live", async () => {
      element.searchProvider = async () => {
        throw new Error("Network error");
      };

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector(".error-message") !== null,
        "Error message should appear",
        { timeout: 2000 }
      );

      const error = element.shadowRoot?.querySelector(".error-message");
      expect(error?.getAttribute("role")).to.equal("alert");
      expect(error?.getAttribute("aria-live")).to.equal("assertive");
    });
  });

  describe("Focus Management", () => {
    it("should clear focused item when dropdown closes", async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );

      // Focus an item
      const form = element.shadowRoot?.querySelector("form");
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      );
      await element.updateComplete;

      // Close dropdown
      form?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
      await element.updateComplete;

      expect(input?.ariaActiveDescendant).to.be.null;
    });
  });

  describe("Loading State Accessibility", () => {
    it("should show spinner during loading without error announcements", async () => {
      let resolveSearch: (value: any[]) => void;
      element.searchProvider = async () => {
        return new Promise((resolve) => {
          resolveSearch = resolve;
        });
      };

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-spinner") !== null,
        "Spinner should appear",
        { timeout: 2000 }
      );

      const spinner = element.shadowRoot?.querySelector("smart-spinner");
      expect(spinner).to.exist;

      // No error message should be present during loading
      const error = element.shadowRoot?.querySelector(".error-message");
      expect(error).to.be.null;

      // Resolve the search
      resolveSearch!(mockResults);
      await element.updateComplete;
    });
  });

  describe("Click Outside Behavior", () => {
    it("should close dropdown when clicking outside", async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );

      // Simulate click outside
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, composed: true })
      );

      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector("smart-dropdown");
      expect(dropdown).to.be.null;
    });
  });

  describe("Form", () => {
    it("should prevent default form submission", async () => {
      element.searchProvider = async () => mockResults;

      const input = element.shadowRoot?.querySelector("smart-input") as any;
      input.dispatchEvent(
        new CustomEvent("input-changed", {
          detail: { value: "test" },
          bubbles: true,
        })
      );

      await waitUntil(
        () => element.shadowRoot?.querySelector("smart-dropdown") !== null,
        "Dropdown should appear",
        { timeout: 2000 }
      );

      const form = element.shadowRoot?.querySelector("form");
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });

      form?.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).to.be.true;
    });
  });
});
