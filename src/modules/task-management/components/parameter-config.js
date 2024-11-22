import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/parameter-config.css?inline';

class ParameterConfig extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
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
      const azimuth = this.shadowRoot.querySelector('input[name="azimuth"]').value;
      const elevation = this.shadowRoot.querySelector('input[name="elevation"]').value;

      console.log('参数配置 - 发送角度:', { azimuth, elevation });

      this.dispatchEvent(new CustomEvent('update-device-angles', {
        detail: { 
          azimuth: azimuth,
          elevation: elevation 
        },
        bubbles: true,
        composed: true
      }));
      
      this.handleClose();
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

    console.log('参数配置 - 发送轨道计算角度:', { azimuth, elevation });

    this.dispatchEvent(new CustomEvent('update-device-angles', {
      detail: {
        azimuth: String(azimuth),
        elevation: String(elevation)
      },
      bubbles: true,
      composed: true
    }));
    this.handleClose();
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
