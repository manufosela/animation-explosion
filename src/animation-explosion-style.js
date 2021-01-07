import { css } from 'lit-element';

export const wcNameStyles = css`
  :host {
    --default-main-color: #ff7900;
  }
  :host *, :host ::after, :host ::before {
    box-sizing: border-box;
  }
  :host * {
    position: absolute;
  }

  .animation-explosion {
    background-color: inherit;
    color: var(--main-color, var(--default-main-color));
  }

  canvas {
    pointer-events: none;
  }
`;
