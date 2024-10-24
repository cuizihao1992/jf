import { LitElement, html, css } from "lit";

class DeviceDetails extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 0px;
      left: calc(100% + 30px);
      display: block;
      width: 400px;
      font-family: "Arial", sans-serif;
      background: linear-gradient(135deg, #003366, #005599);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
    }

    .header {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      padding-bottom: 10px;
    }

    .info-section {
      margin-top: 10px;
    }

    .info-title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 16px;
    }

    .info-item span {
      color: #ffffff; /* 类似图片中的黄色 */
    }
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

customElements.define("device-details", DeviceDetails);
