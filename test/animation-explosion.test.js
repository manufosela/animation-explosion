/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import { html, fixture, expect } from "@open-wc/testing";
import "../animation-explosion";

describe("AnimationExplosion", () => {
  it("should have the basic template", async () => {
    const el = await fixture(
      html`
        <animation-explosion></animation-explosion>
      `
    );
    const base = el.shadowRoot.querySelector(".animation-explosion");

    expect(base).not.to.be.null;
    expect(el).dom.to.equalSnapshot();
  });
});
