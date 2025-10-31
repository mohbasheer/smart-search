import { css } from "lit";

export const demoStyle = css`
  dialog {
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 2rem;
    width: 80%;
    max-width: 500px;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .close-button {
    margin-top: 1rem;
  }

  .details-container {
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .details-container h4 {
    margin-top: 0;
  }

  .no-selection {
    margin-top: 1.5rem;
    color: #888;
  }
`;
