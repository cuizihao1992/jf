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
    // 确保 currentDeviceData 是数组
    const selectedDevices = Array.isArray(window.currentDeviceData) 
        ? window.currentDeviceData 
        : [window.currentDeviceData];
    
    if (!selectedDevices || selectedDevices.length === 0) {
        alert('没有选中的设备数据');
        return;
    }
    
    console.log('计算角度的设备:', selectedDevices);

    if (this.selectedTab === 'inputParams') {
        const azimuth = parseFloat(
            this.shadowRoot.querySelector('input[name="azimuth"]').value
        );
        const elevation = parseFloat(
            this.shadowRoot.querySelector('input[name="elevation"]').value
        );

        if (isNaN(azimuth) || isNaN(elevation)) {
            alert('请输入有效的数值');
            return;
        }

        // 使用 for...of 循环替代 forEach
        for (const deviceData of selectedDevices) {
            const installedAzimuth = parseFloat(deviceData.currentAzimuth || 0);
            const installedElevation = parseFloat(deviceData.currentElevation || 0);

            // 计算差值
            const deltaAzimuth = azimuth - installedAzimuth;
            const deltaElevation = elevation - installedElevation;

            console.log('发送计算结果:', {
                设备ID: deviceData.id,
                差值方位角: deltaAzimuth,
                差值俯仰角: deltaElevation
            });

            // 发送事件
            this.dispatchEvent(new CustomEvent('angles-calculated', {
                detail: {
                    deviceId: deviceData.id,
                    azimuth: deltaAzimuth.toFixed(2),
                    elevation: deltaElevation.toFixed(2),
                    originalAzimuth: azimuth,
                    originalElevation: elevation
                },
                bubbles: true,
                composed: true
            }));
        }

        this.handleClose();
    }

    // 轨道拟合计算
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
      [
        semiMajorAxis,
        visualAngle,
        radiusVector,
        orbitInclination,
        magneticDeclination,
        latitude,
        fixedAngle,
      ].some(isNaN)
    ) {
      
      return;
    }

    // 计算轨道拟合的结果
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
    const calculatedAzimuth =
      (azimuthRad * 180) / Math.PI + magneticDeclination;
    const calculatedElevation = fixedAngle - incidenceRad;

    // 计算差值
    const deltaAzimuth = calculatedAzimuth - installedAzimuth;
    const deltaElevation = calculatedElevation - installedElevation;

    console.log('参数配置 - 轨道计算角度差值:', {
      calculatedAzimuth,
      calculatedElevation,
      installedAzimuth,
      installedElevation,
      deltaAzimuth,
      deltaElevation,
    });

    // 在发送事件之前打印日志
    console.log('发送角度计算结果:', {
      azimuth: deltaAzimuth.toFixed(2),
      elevation: deltaElevation.toFixed(2)
    });

    // 发送计算后的角度差值
    this.dispatchEvent(
      new CustomEvent('angles-calculated', {
        detail: {
          azimuth: deltaAzimuth.toFixed(2),
          elevation: deltaElevation.toFixed(2),
          originalAzimuth: calculatedAzimuth,
          originalElevation: calculatedElevation,
          installedAzimuth: installedAzimuth,
          installedElevation: installedElevation
        },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent('update-device-angles', {
        detail: {
          azimuth: calculatedAzimuth,
          elevation: calculatedElevation,
          currentAzimuth: deviceData?.currentAzimuth || '0',
          currentElevation: deviceData?.currentElevation || '0',
        },
        bubbles: true,
        composed: true,
      })
    );

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
