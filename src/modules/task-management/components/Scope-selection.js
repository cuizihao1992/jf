import { LitElement, html, css } from 'lit';

class ScopeSelection extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 20%;
      left: 50%;
      display: block;
      width: 530px;
      font-family: "Arial", sans-serif;
      background: rgba(13, 31, 51, 0.9);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
      z-index: 2;
    }
    .parameter-config {
      width: 465px;
      margin: 0 auto;
      padding: 15px;
      border: 1px solid rgb(42, 130, 228);
      border-radius: 8px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
      margin-top: -40px;
    }
    .container {
      width: 462px;
      border: white solid 0.5px;
      overflow: hidden;
      margin: 0 auto;
    }
    .tabs {
      display: flex;
      width: 200px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .tab {
      flex: 1;
      text-align: center;
      padding: 10px;
      cursor: pointer;
      background-color: #e0e8ef;
      color: #000;
      font-weight: bold;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .tab[selected] {
      background-color: #4d8fdb;
      color: white;
    }
    .content {
      padding: 16px;
      display: none;
    }
    .content[active] {
      display: block;
    }
    .form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    label {
      margin-left: 0;
      flex-basis: 20%;
      text-align: right;
      white-space: nowrap;
    }
    input[type="text"] {
      width: 80px;
      padding: 4px;
      border-radius: 5px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 130px; /* Adds spacing between buttons */
      margin-top: 10px;
    }
    button {
      padding: 5px 10px;
      background-color: #4d8fdb;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      color: white;
    }
    button:hover {
      background-color: #3c72b4;
    }
    .direction-container, .orbit-container, .attitude-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 16px;
      position: relative;
    }
    .direction-title, .orbit-title, .attitude-title {
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
      gap: 12px;
      margin-bottom: 24px;
    }
    .direction-options {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 24px;
      margin-right: 72px;
      margin-left: 45px;
    }
    .direction-options label, .orbit-parameters .form-group {
      flex: -1 1 50%;
    }
    .attitude-container .form-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .attitude-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* Arrange items in two columns */
      gap: 12px; /* Adds spacing between input groups */
      padding: 16px;
    }
    .close-button {
      position: relative;
      top: -13px;
      left: 450px;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    }
  `;

  static properties = {
    selectedTab: { type: String },
  };

  constructor() {
    super();
    this.selectedTab = 'orbitMatch';
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  render() {
    return html`
      <div class="parameter-config">
        <span class="close-button" @click="${this.handleClose}">×</span>
        <div class="header">范围选择</div>
        <div class="tabs">
          <div
            class="tab"
            ?selected=${this.selectedTab === 'orbitMatch'}
            @click=${() => this.selectTab('orbitMatch')}
          >
            轨道拟合
          </div>
          <div
            class="tab"
            ?selected=${this.selectedTab === 'inputParams'}
            @click=${() => this.selectTab('inputParams')}
          >
            输入参数
          </div>
        </div>
        <div class="container">
          <div class="content" ?active=${this.selectedTab === 'orbitMatch'}>
            <div class="orbit-container">
              <span class="orbit-title">轨道参数</span>
              <div class="direction-options">
                <label><input type="checkbox" name="direction" value="leftView" />左向侧视</label>
                <label><input type="checkbox" name="direction" value="rightView" />右向侧视</label>
              </div>
              <div class="orbit-parameters">
                <div class="form-group">
                  <label>近距端视角：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>半长轴：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>轨道倾角：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>升交点精度：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>扩展范围：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>远距端视角：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>离心率：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>近心点辐角：</label>
                  <input type="text"/>
                </div>
                <div class="form-group">
                  <label>真近点角：</label>
                  <input type="text"/>
                </div>
              </div>
            </div>
            <div class="button-container">
              <button>确定</button>
            </div>
          </div>

          <div class="content" ?active=${this.selectedTab === 'inputParams'}>
            <div class="attitude-container">
              <div class="form-group">
                <label>左上:</label>
                <input type="text" />
                <button class="pick-button">拾取</button>
              </div>
              <div class="form-group">
                <label>右上:</label>
                <input type="text" />
                <button class="pick-button">拾取</button>
              </div>
              <div class="form-group">
                <label>左下:</label>
                <input type="text" />
                <button class="pick-button">拾取</button>
              </div>
              <div class="form-group">
                <label>右下:</label>
                <input type="text" />
                <button class="pick-button">拾取</button>
              </div>
            </div>
            <div class="button-container">
              <button>绘制范围</button>
              <button>拟合</button>
              <button>确定</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('scope-selection', ScopeSelection);
