import { css } from "lit";

export const filterStyles = css`
  :host {
    display: block;
    margin-bottom: 0.5rem;
    background: var(--smart-search-background-color, #f8f9fa);
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--smart-search-border-color, #e0e0e0);
    max-width: 100%;
  }
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    align-items: center;
    min-height: 32px;
  }
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: var(--smart-search-background-color, #fff);
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--smart-search-border-color, #e0e0e0);
  }
  label {
    font-size: 0.95rem;
    color: var(--smart-search-foreground-color, #333);
    font-weight: 500;
    margin-right: 0.3rem;
  }
  input[type="checkbox"],
  input[type="date"],
  select {
    border-radius: 3px;
    border: 1px solid var(--smart-search-border-color, #ccc);
    padding: 0.12rem 0.3rem;
    font-size: 0.97rem;
    background: var(--smart-search-background-color, #fff);
    transition: border 0.2s;
    min-height: 24px;
  }
  input[type="checkbox"] {
    width: 1em;
    height: 1em;
    margin-right: 0.2em;
  }
  input[type="date"] {
    min-width: 110px;
  }
  select {
    min-width: 90px;
    background-color: var(--smart-search-background-color, #fff);
    color: var(--smart-search-foreground-color, #111);
  }
`;
