import { css } from 'lit';

export const sharedStyles = css`
  :host {
    position: absolute;
    left: 0px;
    display: flex;
    flex-direction: column;
    align-items: center; /* Optional: to center the buttons horizontally */
    justify-content: center; /* Optional: to center the buttons vertically */
    gap: 10px; /* Optional: adds space between buttons */
  }
`;
