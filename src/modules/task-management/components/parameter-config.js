import { LitElement, html, css } from 'lit';

class ParameterConfig extends LitElement {
  static styles = css`
    :host {
      top: 39%;
      left: calc(50% + 550px);
      position: fixed;
      display: block;
      width: 540px;
      font-family: 'Arial', sans-serif;
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
      justify-content: space-between;
    }
    label {
      margin-left: 4px;
    }
    input[type='text'] {
      width: 80px;
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
    .direction-container,
    .orbit-container,
    .attitude-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 16px;
      position: relative;
    }
    .direction-title,
    .orbit-title,
    .attitude-title {
      position: absolute;
      top: -12px;
      left: 10px;
      background-color: #31384f;
      padding: 0 4px;
      font-weight: bold;
    }
    .direction-options,
    .orbit-parameters {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .direction-options label,
    .orbit-parameters .form-group {
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

  calculateAngles() {
    if (this.selectedTab === 'inputParams') {
      const azimuth = this.shadowRoot.querySelector(
        'input[name="azimuth"]'
      ).value;
      const elevation = this.shadowRoot.querySelector(
        'input[name="elevation"]'
      ).value;

      alert(`方位角: ${azimuth}°\n俯仰角: ${elevation}°`);
      return;
    }

    const semiMajorAxis = parseFloat(
      this.shadowRoot.querySelector('input[name="semiMajorAxis"]').value
    );
    const visualAngle = parseFloat(
      this.shadowRoot.querySelector('input[name="visualAngle"]').value
    );
    const radiusVector = parseFloat(
      this.shadowRoot.querySelector('input[name="radiusVector"]').value
    );
    const orbitInclination = parseFloat(
      this.shadowRoot.querySelector('input[name="orbitInclination"]').value
    );
    const magneticDeclination = parseFloat(
      this.shadowRoot.querySelector('input[name="magneticDeclination"]').value
    );
    const latitude = parseFloat(
      this.shadowRoot.querySelector('input[name="latitude"]').value
    );
    const fixedAngle = parseFloat(
      this.shadowRoot.querySelector('input[name="fixedAngle"]').value
    );

    if (
      isNaN(semiMajorAxis) ||
      isNaN(visualAngle) ||
      isNaN(radiusVector) ||
      isNaN(orbitInclination) ||
      isNaN(magneticDeclination) ||
      isNaN(latitude) ||
      isNaN(fixedAngle)
    ) {
      alert('请输入有效的数值');
      return;
    }

    const incidenceRad =
      Math.asin(
        (semiMajorAxis * Math.sin((visualAngle * Math.PI) / 180)) / radiusVector
      ) *
      (180 / Math.PI);

    const trajectory = this.shadowRoot.querySelector(
      'input[name="trajectory"]:checked'
    ).value;
    const cosValue =
      Math.cos((orbitInclination * Math.PI) / 180) /
      Math.cos((latitude * Math.PI) / 180);
    const azimuthRad = Math.asin(
      trajectory === 'ascend' ? cosValue : -cosValue
    );
    const azimuth = (azimuthRad * 180) / Math.PI + magneticDeclination;

    const elevation = fixedAngle - incidenceRad;

    alert(`方位角: ${azimuth.toFixed(2)}°\n俯仰角: ${elevation.toFixed(2)}°`);
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

                <label
                  ><input
                    type="radio"
                    name="trajectory"
                    value="ascend"
                  />升轨</label
                >
                <label
                  ><input
                    type="radio"
                    name="trajectory"
                    value="descend"
                  />降轨</label
                >
              </div>
            </div>

            <div class="orbit-container">
              <span class="orbit-title">卫星轨道参数</span>
              <div class="orbit-parameters">
                <div class="form-group">
                  <label>视角：</label>
                  <input type="text" name="visualAngle" />
                </div>
                <div class="form-group">
                  <label>半长轴：</label>
                  <input type="text" name="semiMajorAxis" />
                </div>
                <div class="form-group">
                  <label>轨道倾角：</label>
                  <input type="text" name="orbitInclination" />
                </div>
                <div class="form-group">
                  <label>磁偏角：</label>
                  <input type="text" name="magneticDeclination" />
                </div>
                <div class="form-group">
                  <label>地面点矢量半径：</label>
                  <input type="text" name="radiusVector" />
                </div>
                <div class="form-group">
                  <label>固定角：</label>
                  <input type="text" name="fixedAngle" />
                </div>
                <div class="form-group">
                  <label>成像中心纬度：</label>
                  <input type="text" name="latitude" />
                </div>
              </div>
            </div>
          </div>

          <div class="content" ?active=${this.selectedTab === 'inputParams'}>
            <div class="attitude-container">
              <span class="attitude-title">姿态参数</span>
              <div class="form-group">
                <label>方位角:</label>
                <input type="text" name="azimuth" />
                <label>俯仰角:</label>
                <input type="text" name="elevation" />
              </div>
            </div>
          </div>
        </div>
        <div class="button-container">
          <button @click="${this.calculateAngles}">确定</button>
        </div>
      </div>
    `;
  }

  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('parameter-config', ParameterConfig);
