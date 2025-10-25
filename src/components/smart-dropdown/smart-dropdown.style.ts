import { css } from "lit";

export const dropdownStyles = css`
  :host {
    display: block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    overflow: hidden;
    max-height: 300px;
    overflow-y: auto;
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

  li:hover {
    background-color: #f5f5f5;
  }

  li.active {
    background-color: #e0e0e0;
    font-weight: bold;
  }
`;
