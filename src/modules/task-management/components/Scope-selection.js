import { LitElement, html, css } from 'lit';

class ScopeSelection extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 23.7%;
      left: calc(50% + 315px);
      width: fit-content;
      background: rgba(13, 31, 51, 0.9);
      color: white;
      border-radius: 10px;
      padding: 20px;
      z-index: 2;
    }

    .parameter-config {
      border: 1px solid rgb(42, 130, 228);
      border-radius: 8px;
      padding: 15px;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: -29px;
      text-align: left;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .tab {
      padding: 8px 16px;
      background: #4d8fdb;
      border-radius: 4px;
      cursor: pointer;
    }

    .tab[selected] {
      background: #2a5a8a;
    }

    .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 5px;
      justify-content: end;
    }
    .coordinates-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 25px;
      justify-content: center;
    }

    label {
      margin-left: 0;
      text-align: right;
      white-space: nowrap;
    }

    input[type='orbit-text'] {
      width: 115px;
      padding: 4px;
      border-radius: 5px;
    }
    input[type='text'] {
      width: 200px;
      padding: 4px;
      border-radius: 5px;
    }

    button {
      padding: 5px 10px;
      background: #4d8fdb;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      width: auto;
      white-space: nowrap;
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      gap: 82px; /* Adds spacing between buttons */
      margin-top: 10px;
    }

    .coordinates-container {
      border: 1px solid #ccc;
      padding: 15px;
      border-radius: 4px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .coordinates-group {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 45%; // 设置为大约一半的宽度
    }

    input[type='text'] {
      width: 130px; // 减小输入框宽度
      padding: 4px;
      border-radius: 5px;
    }
    .direction-options {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 24px;
      margin-right: 72px;
      margin-left: 45px;
    }
    .orbit-container,
    .attitude-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 16px;
      position: relative;
    }
    .orbit-title,
    .attitude-title {
      position: absolute;
      top: -12px;
      left: 10px;
      background-color: #31384f;
      padding: 0 4px;
      font-weight: bold;
    }
    .orbit-parameters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }
    .close-button {
      position: absolute;
      right: 30px;
      top: 20px;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    }
    button.active {
      background: #2a5a8a;
    }

    button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      background: #666;
    }

    button[disabled]:hover {
      opacity: 0.5;
    }

    button:not([disabled]):hover {
      background: #2a5a8a;
    }
    [title] {
      position: relative;
    }
    [title]:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
    }
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
      composed: true
    });
    this.dispatchEvent(event);
  
    // 使用全局 map 实例
    if (window.mapInstance) {
      const count = window.mapInstance.querySourceFeatures('selected-points').length;
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
