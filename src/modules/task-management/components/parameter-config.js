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
    // 从 window 事件中获取当前设备的安装姿态
    const deviceData = window.currentDeviceData; // 这个变量需要在打开参数配置时设置
    const installedAzimuth = parseFloat(deviceData?.currentAzimuth || 0);
    const installedElevation = parseFloat(deviceData?.currentElevation || 0);

    if (this.selectedTab === 'inputParams') {
      const azimuth = parseFloat(this.shadowRoot.querySelector('input[name="azimuth"]').value);
      const elevation = parseFloat(this.shadowRoot.querySelector('input[name="elevation"]').value);

      if (isNaN(azimuth) || isNaN(elevation)) {
        alert('请输入有效的数值');
        return;
      }

      // 计算差值
      const deltaAzimuth = azimuth - installedAzimuth;
      const deltaElevation = elevation - installedElevation;

      console.log('参数配置 - 计算角度差值:', { 
        原始方位角: azimuth,
        原始俯仰角: elevation,
        安装方位角: installedAzimuth,
        安装俯仰角: installedElevation,
        差值方位角: deltaAzimuth,
        差值俯仰角: deltaElevation
      });

      this.dispatchEvent(new CustomEvent('angles-calculated', {
        detail: { 
          azimuth: deltaAzimuth.toFixed(2),
          elevation: deltaElevation.toFixed(2)
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

    // 计算轨道拟合的结果
    const incidenceRad = Math.asin(
      (semiMajorAxis * Math.sin((visualAngle * Math.PI) / 180)) / radiusVector
    ) * (180 / Math.PI);

    const trajectory = this.shadowRoot.querySelector(
      'input[name="trajectory"]:checked'
    ).value;
    const cosValue = Math.cos((orbitInclination * Math.PI) / 180) /
      Math.cos((latitude * Math.PI) / 180);
    const azimuthRad = Math.asin(
      trajectory === 'ascend' ? cosValue : -cosValue
    );
    const calculatedAzimuth = (azimuthRad * 180) / Math.PI + magneticDeclination;
    const calculatedElevation = fixedAngle - incidenceRad;

    // 计算差值
    const deltaAzimuth = calculatedAzimuth - installedAzimuth;
    const deltaElevation = calculatedElevation - installedElevation;

    console.log('参数配置 - 轨道计算角度差值:', {
      计算方位角: calculatedAzimuth,
      计算俯仰角: calculatedElevation,
      安装方位角: installedAzimuth,
      安装俯仰角: installedElevation,
      差值方位角: deltaAzimuth,
      差值俯仰角: deltaElevation
    });

    this.dispatchEvent(new CustomEvent('angles-calculated', {
      detail: {
        azimuth: deltaAzimuth.toFixed(2),
        elevation: deltaElevation.toFixed(2)
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
