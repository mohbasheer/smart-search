import { css } from "lit";

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    color: var(--smart-search-button-background-color, #757575);
  }

  button:hover {
    color: var(--smart-search-button-hover-background-color, #000);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;
