import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-details.css?inline';

class DeviceDetails extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <div class="header">设备详情</div>
      <div class="info-section">
        <div class="info-title">设备信息</div>
        <div class="info-item"><span>设备编号：</span><span>101</span></div>
        <div class="info-item"><span>所属地区：</span><span>中卫</span></div>
        <div class="info-item">
          <span>设备类型：</span><span>自动角反射器</span>
        </div>
        <div class="info-item">
          <span>磁偏角度：</span><span>自动角反射器</span>
        </div>
        <div class="info-item"><span>安装方位角度：</span><span></span></div>
        <div class="info-item"><span>安装俯仰角度：</span><span></span></div>
        <div class="info-item"><span>设备所在经度：</span><span></span></div>
        <div class="info-item"><span>设备所在纬度：</span><span></span></div>
      </div>
    `;
  }
}

customElements.define('device-details', DeviceDetails);
