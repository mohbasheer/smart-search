import { css } from "lit";

// Base input styling
export const baseInputStyles = css`
  input {
    padding: 8px 12px;
    border: 1px solid var(--smart-search-border-color, #ccc);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-color: var(--smart-search-background-color, #fff);
    color: var(--smart-search-font-color, #111);
  }

  input::placeholder {
    color: var(--smart-search-font-color, #9e9e9e);
  }
`;
