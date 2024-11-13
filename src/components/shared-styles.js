import { css } from 'lit';

export const sharedStyles = css`
  :host {
  }
  .panel {
    position: absolute;
    left: 3%;
  }
  .panel-right {
    position: absolute;
    right: 5%;
  }
  .left-buttons {
    position: absolute;
    left: 0px;
    top: 147px;
    display: flex;
    flex-direction: column;
    align-items: center; /* Optional: to center the buttons horizontally */
    justify-content: center; /* Optional: to center the buttons vertically */
    gap: 10px; /* Optional: adds space between buttons */
  }
`;
