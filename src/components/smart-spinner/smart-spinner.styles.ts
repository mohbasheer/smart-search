import { css } from "lit";

export const styles = css`
  .spinner {
    border: 2px solid rgba(var(--smart-search-spinner-background-color), 0.1);
    border-left-color: var(--smart-search-spinner-border-color, #000);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
