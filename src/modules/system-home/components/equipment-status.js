import { LitElement, html, css } from 'lit';

class EquipmentStatus extends LitElement {
  static styles = css`
    .container {
      color: #ffffff;
      padding: 16px;
      font-family: 'Microsoft YaHei', sans-serif;
      position: absolute;
      right: 0px;
      top: 142px;
      width: 384px;
      height: 530px;
      opacity: 1;
      background-color: #0f0f0f;
      background-image: url(/images/home-left-bg.png);
      background-size: auto;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .content {
      line-height: 1.8;
      font-weight: 400;
      font-size: 30px;
    }
    .section-title {
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 5px;
    }
    .equipment-list {
      letter-spacing: 0px;
      line-height: 32.7px;
    }
    .equipment-list span {
      color: rgba(42, 130, 228, 1);
    }

    .header {
      align-items: center;
      font-size: 36px;
      letter-spacing: 0px;
      line-height: 52.13px;
      text-align: left;
      vertical-align: top;
      background-image: url(/images/home-panel-header.png);
      background-size: cover; /* 确保背景图片覆盖按钮 */
      background-repeat: no-repeat;
      background-position: center;
      padding-left: 70px;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span>设备情况</span>
        </div>
        <div class="content">
          <div class="section-title">中卫定标场:</div>
          <div class="equipment-list">
            自动角反射器 <span>24台</span><br />
            有源定标器 <span>15台</span><br />
            点光源 <span>10台</span><br />
            激光几何定标器 <span>5台</span>
          </div>

          <div class="section-title">嵩山定标场:</div>
          <div class="equipment-list">
            自动角反射器 <span>32台</span><br />
            有源定标器 <span>15台</span><br />
            点光源 <span>15台</span><br />
            激光几何定标器 <span>8台</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('equipment-status', EquipmentStatus);
