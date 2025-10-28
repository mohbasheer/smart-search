import { css } from "lit";

export const theme = css`
  :host {
    --smart-search-background-color: #ffffff;
    --smart-search-foreground-color: #111111;
    --smart-search-font-color: #111111;
    --smart-search-border-color: #e6e6e6;

    --smart-search-spinner-background-color: 0, 0, 0;
    --smart-search-spinner-border-color: #000000;

    --smart-search-button-background-color: #1f1f1f;
    --smart-search-button-hover-background-color: #2a2a2a;

    --smart-search-dropdown-hover-color: #f5f5f5;
    --smart-search-icon-color: #444444;
    --smart-search-dropdown-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  :host([theme="dark"]) {
    --smart-search-background-color: #1f1f1f;
    --smart-search-foreground-color: #f7f7f7;
    --smart-search-font-color: #f7f7f7;
    --smart-search-border-color: #333333;

    --smart-search-spinner-background-color: 255, 255, 255;
    --smart-search-spinner-border-color: #fff;

    --smart-search-button-background-color: #ffffff;
    --smart-search-button-hover-background-color: #f5f5f5;

    --smart-search-dropdown-hover-color: #2a2a2a;
    --smart-search-icon-color: #d0d0d0;
    --smart-search-dropdown-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  }
`;
