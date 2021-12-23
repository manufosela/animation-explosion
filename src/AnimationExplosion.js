import { LitElement, html } from "lit-element";
import { wcNameStyles } from "./animation-explosion-style";

/**
 * `animation-explosion`
 * AnimationExplosion
 *
 * @customElement animation-explosion
 * @litElement
 * @demo demo/index.html
 */

export class AnimationExplosion extends LitElement {
  static get is() {
    return "animation-explosion";
  }

  static get properties() {
    return {
      /**
       * Number of bubles of the explosion
       * @property
       * @type { Number }
       */
      bubbles: { type: Number },
      /**
       * bubleColors of explosion
       * @property
       * @type { Array }
       */
      bubleColors: { 
        type: Array, 
        attribute: 'buble-colors',
        converter: { 
          fromAttribute: (value) => { 
            const retVal = value.split(',');
            return retVal;
          },
          toAttribute: (value) => { 
            const retVal = value.join(',');
            return retVal;
          }
        }
      },
      /**
       * Size of the explosion
       * @property
       * @type { Number }
       */
      size: { type: Number },
      /**
       * Particle size average of the explosion
       * @property
       * @type { Number }
       */
      particleSize: { type: Number, attribute: 'particle-size' },
      /**
       * speed of the explosion
       * @property
       * @type { Number }
       */
      speed: { type: Number },
    };
  }

  static get styles() {
    return [wcNameStyles];
  }

  constructor() {
    super();
    this.bubleColors = ['#ffc000', '#ff3b3b', '#ff8400'];
    this.bubbles = 25;
    this.size = 200;
    this.particleSize = 20;
    this.particleRadiusMin = this.particleSize * 0.5;
    this.particleRadiusMax = this.particleSize * 1.5;
    this.speed = 10;
    this.speedMin = this.speed * 0.5;
    this.speedMax = this.speed * 1.5;
    this.friction = 0.9;
    this.yVel = 0;
    this.gravity = 0.1;

    this.particles = [];
    this.timeStartRef = {}

    document.addEventListener('animation-explosion_explode', this.eventExplodeDispatched.bind(this));
  }

  firstUpdated() {
    const style = this.shadowRoot.querySelector('style');
    style.innerHTML = `:host { width: ${this.size}px; height:${this.size}px; }`;
  }

  eventExplodeDispatched(ev) {
    const {detail} = ev;
    const {id} = detail;
    if (id === this.id) {
      this.explode();
    }
  }

  showExplosion(timetoExplode = 0) {
    setTimeout(()=>{
      this.explode();
    }, timetoExplode);
  }

  ramdomValue(baseValue = 1, maxValue = 0, numDecimals = 0) {
    this._null = null;
    const randomValue = parseFloat((Math.random() * (baseValue - maxValue)) + maxValue).toFixed(numDecimals);
    return randomValue;
  }

  generateBubles() {
    for (let i = 0; i < this.bubbles; i+=1) {
      this.particles.push({
        x: this.size / 2,
        y: this.size / 4,
        radius: this.ramdomValue(this.particleRadiusMin, this.particleRadiusMax),
        color: this.bubleColors[Math.floor(Math.random() * this.bubleColors.length)],
        rotation: this.ramdomValue(0, 360, true),
        speed: this.ramdomValue(this.speedMin, this.speedMax),
        friction: this.friction,
        opacity: this.ramdomValue(0.3, 1, true),
        yVel: this.yVel,
        gravity: this.gravity
      });
    }
  }

  explode() {
    const explosionReference = new Date().getTime();
    const id = `canvas_${explosionReference}`;
    const canvasElement = document.createElement('canvas');
    canvasElement.id = id;
    const canvasContext = canvasElement.getContext('2d');
    canvasElement.classList.add('animation-explosion__canvas');
    canvasElement.style.width = `${this.size  }px`;
    canvasElement.style.height = `${this.size  }px`;
    canvasElement.style.zIndex = this.size / 2;
    canvasElement.width = this.size;
    canvasElement.height = this.size;
    this.shadowRoot.getElementById('canvasContainer').appendChild(canvasElement);
    this.requestUpdate();

    this.generateBubles();

    requestAnimationFrame((internClock) => { this.renderExplosion(explosionReference, canvasContext, internClock) });
  }

  renderExplosion(explosionReference, canvasContext, internClock) {
    if (!this.timeStartRef[explosionReference]) { 
      this.timeStartRef[explosionReference] = internClock;
    }
    const progress = internClock - this.timeStartRef[explosionReference];
    if (progress < 1000) {
      requestAnimationFrame((internClck) => { this.renderExplosion(explosionReference, canvasContext, internClck) });
    } else {
     this.shadowRoot.getElementById(`canvas_${explosionReference}`).remove(this.canvasElement);
    }
    canvasContext.clearRect(0, 0, this.size, this.size);

    this.particles.forEach((particle) => {
      particle.x += particle.speed * Math.cos(particle.rotation * Math.PI / 180);
      particle.y += particle.speed * Math.sin(particle.rotation * Math.PI / 180);

      particle.opacity -= 0.01;
      particle.speed *= particle.friction;
      particle.radius *= particle.friction;
      particle.yVel += particle.gravity;
      particle.y += particle.yVel;

      if (particle.opacity < 0 || particle.radius < 0) return;

      canvasContext.beginPath();
      canvasContext.globalAlpha = particle.opacity;
      canvasContext.fillStyle = particle.color;
      canvasContext.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, false);
      canvasContext.fill();
    });
  }

  render() {
    return html`
      <style></style>
      <div id="canvasContainer">
        <!-- Canvas explosion generated by code -->
      </div>
    `;
  }
}