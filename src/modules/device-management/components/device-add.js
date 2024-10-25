import { LitElement, html, css } from "lit";

class DeviceAdd extends LitElement {
  static styles = css`
    .container {
      width: 509px;
      height: 575px;
      color: #fff;
      padding: 20px;
      font-family: "Microsoft YaHei", sans-serif;
      border: 2px solid #00bfff;
      box-shadow: 0 0 10px #00bfff;

      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 23.17px;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      vertical-align: top;

      background-image: url(/images/add-device-bg.png);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .title {
      margin-bottom: 40px;
      /** 文本1 */
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 34.75px;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      vertical-align: top;
    }
    .form-wrap {
      background-color: gray;
      padding: 20px 35px;
      position: relative;
    }

    .form-title {
      font-size: 18px;
      margin-bottom: 10px;
      position: absolute;
      top: -10px;
    }

    .form-group {
      margin-bottom: 10px;
      display: flex;
      /* justify-content: space-between; */
    }

    .form-group label {
      display: block;
      font-size: 16px;
      margin-bottom: 5px;
      width: 40%;
    }

    .form-group input,
    .form-group select {
      width: 170px;
      /* height: 21px; */
      padding: 8px;
      font-size: 16px;
      background-color: #cccccc;
      border: none;
      outline: none;
    }

    .form-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .btn {
      width: 100px;
      padding: 10px;
      background-color: #003b55;
      border: 2px solid #00bfff;
      color: #fff;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #004d70;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="title">新增设备</div>
        <div class="form-wrap">
          <div class="form-title">设备信息</div>

          <div class="form-group">
            <label for="username">提交用户名：</label>
            <input type="text" id="username" />
          </div>

          <div class="form-group">
            <label for="device-id">设备编号：</label>
            <input type="text" id="device-id" />
          </div>

          <div class="form-group">
            <label for="angle">磁偏角度：</label>
            <input type="text" id="angle" />
          </div>

          <div class="form-group">
            <label for="region">所属地区：</label>
            <select id="region">
              <option>中卫</option>
              <option>嵩山</option>
            </select>
          </div>

          <div class="form-group">
            <label for="device-type">设备类型：</label>
            <select id="device-type">
              <option>自动角反射器</option>
              <option>有源定标器</option>
            </select>
          </div>

          <div class="form-group">
            <label for="azimuth">安装方位角度：</label>
            <input type="text" id="azimuth" />
          </div>

          <div class="form-group">
            <label for="elevation">安装仰仰角度：</label>
            <input type="text" id="elevation" />
          </div>

          <div class="form-group">
            <label for="longitude">设备所在经度：</label>
            <input type="text" id="longitude" />
          </div>

          <div class="form-group">
            <label for="latitude">设备所在纬度：</label>
            <input type="text" id="latitude" />
          </div>

          <div class="form-group">
            <label for="year">安装年份：</label>
            <input type="text" id="year" />
          </div>
        </div>
        <div class="form-buttons">
          <div class="btn">提交</div>
          <div class="btn">取消</div>
        </div>
      </div>
    `;
  }
}

customElements.define("device-add", DeviceAdd);
