import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/scope-selection.css?inline';

class ScopeSelection extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    coordinates: { state: true },
    selectedTab: { type: String },
    drawMode: { type: String },
    hasDrawnPolygon: { type: Boolean },
  };

  constructor() {
    super();
    this.coordinates = {
      左上: '',
      右上: '',
      左下: '',
      右下: '',
    };
    this.selectedTab = 'inputParams';
    this.drawMode = 'pick';
    this.hasDrawnPolygon = false;
  }
  handleFitClick() {
    const event = new CustomEvent('fit-diagonal-points', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
  firstUpdated() {
    window.addEventListener('update-coordinates', (e) => {
      console.log('Received coordinates:', e.detail);
      const { position, coordinates } = e.detail;
      this.coordinates = {
        ...this.coordinates,
        [position]: coordinates,
      };
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'update-coordinates',
      this.handleUpdateCoordinates
    );
  }

  toggleDrawMode(mode) {
    if (this.drawMode === mode) return;

    this.drawMode = mode;
    const event = new CustomEvent('clear-all-features', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    if (mode === 'draw') {
      this.coordinates = {
        左上: '',
        右上: '',
        左下: '',
        右下: '',
      };
    }

    const modeEvent = new CustomEvent('change-draw-mode', {
      detail: { mode },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(modeEvent);
  }

  handlePickClick(position) {
    if (this.drawMode === 'draw') return;

    this.toggleDrawMode('pick');

    console.log('Pick button clicked:', position);
    const event = new CustomEvent('start-picking', {
      detail: { position },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleConfirmClick() {
    const event = new CustomEvent('draw-polygon', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    // 使用全局 map 实例
    if (window.mapInstance) {
      const count =
        window.mapInstance.querySourceFeatures('selected-points').length;
      alert(`选中点位数量: ${count}`);
    }
  }
  render() {
    console.log('Current coordinates:', this.coordinates);
    return html`
      <div class="parameter-config">
        <div class="header">范围选择</div>
        <div class="close-button" @click=${this.handleClose}>
          <span>×</span>
        </div>
        <div class="tabs">
          <div
            class="tab"
            ?selected=${this.selectedTab === 'orbitMatch'}
            @click=${() => (this.selectedTab = 'orbitMatch')}
          >
            轨道拟合
          </div>
          <div
            class="tab"
            ?selected=${this.selectedTab === 'inputParams'}
            @click=${() => (this.selectedTab = 'inputParams')}
          >
            输入参数
          </div>
        </div>

        ${this.selectedTab === 'inputParams'
          ? html`
              <div class="coordinates-container">
                <div class="coordinates-group">
                  <label>左上:</label>
                  <input
                    type="text"
                    value="${this.coordinates['左上']}"
                    readonly
                  />
                  <button
                    @click=${() => this.handlePickClick('左上')}
                    ?disabled=${this.drawMode === 'draw'}
                    title="${this.drawMode === 'draw'
                      ? '绘制模式下无法拾取点位'
                      : ''}"
                  >
                    拾取
                  </button>
                </div>
                <div class="coordinates-group">
                  <label>右上:</label>
                  <input
                    type="text"
                    value="${this.coordinates['右上']}"
                    readonly
                  />
                  <button
                    @click=${() => this.handlePickClick('右上')}
                    ?disabled=${this.drawMode === 'draw'}
                    title="${this.drawMode === 'draw'
                      ? '绘制模式下无法拾取点位'
                      : ''}"
                  >
                    拾取
                  </button>
                </div>
                <div class="coordinates-group">
                  <label>左下:</label>
                  <input
                    type="text"
                    value="${this.coordinates['左下']}"
                    readonly
                  />
                  <button
                    @click=${() => this.handlePickClick('左下')}
                    ?disabled=${this.drawMode === 'draw'}
                    title="${this.drawMode === 'draw'
                      ? '绘制模式下无法拾取点位'
                      : ''}"
                  >
                    拾取
                  </button>
                </div>
                <div class="coordinates-group">
                  <label>右下:</label>
                  <input
                    type="text"
                    value="${this.coordinates['右下']}"
                    readonly
                  />
                  <button
                    @click=${() => this.handlePickClick('右下')}
                    ?disabled=${this.drawMode === 'draw'}
                    title="${this.drawMode === 'draw'
                      ? '绘制模式下无法拾取点位'
                      : ''}"
                  >
                    拾取
                  </button>
                </div>
              </div>

              <div class="button-container">
                <button
                  @click=${() => this.toggleDrawMode('draw')}
                  class="${this.drawMode === 'draw' ? 'active' : ''}"
                  ?disabled=${Object.values(this.coordinates).some((v) => v)}
                  title="${Object.values(this.coordinates).some((v) => v)
                    ? '已有拾取的点位，请先清除'
                    : ''}"
                >
                  绘制范围
                </button>
                <button
                  @click=${() => this.toggleDrawMode('pick')}
                  class="${this.drawMode === 'pick' ? 'active' : ''}"
                >
                  拾取模式
                </button>
                <button @click=${this.handleFitClick}>拟合</button>
                <button
                  @click=${this.handleConfirmClick}
                  ?disabled=${this.drawMode === 'draw' && !this.hasDrawnPolygon}
                >
                  确定
                </button>
              </div>
            `
          : html`
              <div class="container">
                <div
                  class="content"
                  ?active=${this.selectedTab === 'orbitMatch'}
                >
                  <div class="orbit-container">
                    <span class="orbit-title">轨道参数</span>
                    <div class="direction-options">
                      <label
                        ><input
                          type="checkbox"
                          name="direction"
                          value="leftView"
                        />左向侧视</label
                      >
                      <label
                        ><input
                          type="checkbox"
                          name="direction"
                          value="rightView"
                        />右向侧视</label
                      >
                    </div>
                    <div class="orbit-parameters">
                      <div class="form-group">
                        <label>近距端视角：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>半长轴：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>轨道倾角：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>升交点精度：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>扩展范围：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>远距端视角：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>离心率：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>近心点辐角：</label>
                        <input type="orbit-text" />
                      </div>
                      <div class="form-group">
                        <label>真近点角：</label>
                        <input type="orbit-text" />
                      </div>
                    </div>
                  </div>
                  <div class="button-container">
                    <button>确定</button>
                  </div>
                </div>
              </div>
            `}
      </div>
    `;
  }
  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('scope-selection', ScopeSelection);
