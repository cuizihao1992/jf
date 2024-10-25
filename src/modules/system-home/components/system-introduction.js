import { LitElement, html, css } from "lit";

class SystemIntroduction extends LitElement {
  static styles = css`
    .container {
      color: #ffffff;
      padding: 16px;
      font-family: "Microsoft YaHei", sans-serif;
      position: absolute;
      left: 4px;
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
      margin-bottom: 15px;

    }

    .content {
      width: 363px;
      height: 417px;
      opacity: 1;
      font-size: 30px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 32.7px;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      vertical-align: top;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span>系统简介</span>
        </div>
        <div class="content">
          自动角反射器设备，具备远程控制角反射器指向的功能，实现全天时全天候、无人值守的工作模式。
          自动角反射器可视化与控制系统是对自动角反射器进行全方位、一体化的管理系统。
          系统包括：系统信息简介、设备监控、任务管理、信息管理及电源连接等基本功能。
        </div>
      </div>
    `;
  }
}

customElements.define("system-introduction", SystemIntroduction);
