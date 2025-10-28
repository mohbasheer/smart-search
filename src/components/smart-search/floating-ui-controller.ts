import { ReactiveController, ReactiveControllerHost } from "lit";
import {
  computePosition,
  flip,
  size,
  offset,
  autoUpdate,
} from "@floating-ui/dom";

export class FloatingUIController implements ReactiveController {
  private host: ReactiveControllerHost;
  private cleanup: (() => void) | null = null;
  private inputElement: HTMLElement | null = null;
  private dropdownElement: HTMLElement | null = null;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this.host.addController(this);
  }

  setElements(input: HTMLElement, dropdown: HTMLElement) {
    this.inputElement = input;
    this.dropdownElement = dropdown;
  }

  updatePosition() {
    this.clear();

    if (!this.inputElement || !this.dropdownElement) {
      return;
    }

    this.cleanup = autoUpdate(
      this.inputElement,
      this.dropdownElement,
      async () => {
        const { x, y } = await computePosition(
          this.inputElement!,
          this.dropdownElement!,
          {
            placement: "bottom-start",
            middleware: [
              offset(3),
              flip(),
              size({
                padding: 8,
                apply: ({ availableHeight, rects }) => {
                  Object.assign(this.dropdownElement!.style, {
                    width: `${rects.reference.width}px`,
                    maxHeight: `${availableHeight}px`,
                  });
                },
              }),
            ],
          }
        );

        Object.assign(this.dropdownElement!.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      }
    );
  }

  clear() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  hostDisconnected() {
    this.clear();
  }
}
