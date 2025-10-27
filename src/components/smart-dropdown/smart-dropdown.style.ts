import { css } from "lit";

export const dropdownStyles = css`
  :host {
    display: block;
    position: absolute;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    overflow: hidden;
    overflow-y: auto;
    z-index: 10;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }

  li:last-child {
    border-bottom: none;
  }

  li.selected {
    background-color: #e0e0e0;
    font-weight: bold;
  }

  @media (max-width: 600px) {
    li {
      padding: 14px 12px;
      font-size: 16px;
    }
  }
`;
