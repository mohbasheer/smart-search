import { css } from "lit";

export const styles = css`
  .search-container {
    position: relative;
    display: block;
  }

  smart-input {
    width: 100%;
  }

  smart-spinner {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .no-results {
    padding: 16px;
    text-align: center;
    color: #757575;
    font-style: italic;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff;
  }
`;
