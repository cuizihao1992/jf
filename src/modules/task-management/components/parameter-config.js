import { LitElement, html, css } from "lit";

class ParameterConfig extends LitElement {
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
      width: 450px;
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
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between
    }
    label {
      margin-left: 4px;
    }
    input[type="text"] {
      width: 100px;
      padding: 4px;
      border-radius: 5px;
    }
    .button-container {
      text-align: right;
      margin-top: 10px;
    }
    button {
      padding: 5px 10px;
      background-color: #4d8fdb;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
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
    .direction-options, .orbit-parameters {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between

    }
    .direction-options label, .orbit-parameters .form-group {
      flex: -1 1 50%;
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
        <div class="header">配置参数</div>
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
          <div class="direction-container">
            <span class="direction-title">波束方向</span>
            <div class="direction-options">
              <label><input type="checkbox" name="direction" value="leftView" />左向侧视</label>
              <label><input type="checkbox" name="direction" value="leftView" />右向侧视</label>
              
              <label><input type="radio" name="trajectory" value="ascend" />升轨</label>
              <label><input type="radio" name="trajectory" value="descend" />降轨</label>
            </div>
          </div>
          
          <div class="orbit-container">
            <span class="orbit-title">卫星轨道参数</span>
            <div class="orbit-parameters">
              <div class="form-group">
                <label>视角：</label>
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
                <label>磁偏角：</label>
                <input type="text"/>
              </div>
              <div class="form-group">
                <label>地面点矢量半径：</label>
                <input type="text"/>
              </div>
            </div>
          </div>
        </div>

        <div class="content" ?active=${this.selectedTab === 'inputParams'}>
          <div class="attitude-container">
            <span class="attitude-title">姿态参数</span>
            <div class="form-group">
              <label>方位角:</label>
              <input type="text" />
              <label>俯仰角:</label>
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="button-container">
            <button">确定</button>
      </div>
    </div>
    `;
  }
  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define("parameter-config", ParameterConfig);
