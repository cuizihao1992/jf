import { LitElement, html, css } from 'lit';

class TaskCreateComponent extends LitElement {
  static styles = css`
    .container {
      width: 800px; /* 设置合适的宽度 */
      padding: 20px;
      background-color: #0d1f33;
      color: white;
      font-family: Arial, sans-serif;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    }
    h2 {
      margin: 0;
      padding-bottom: 10px;
      text-align: left;
    }
    .form-container {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .form-container label {
      flex: 1;
      margin-bottom: 10px;
      color: white;
    }
    .form-container input, .form-container select {
      flex: 2;
      margin-bottom: 10px;
      padding: 8px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
      width: 100%;
    }
    .add-button {
      background-color: #58a6ff;
      border: none;
      color: white;
      padding: 10px;
      font-size: 18px;
      cursor: pointer;
      border-radius: 5px;
      width: 40px;
      text-align: center;
    }
    .table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }
    .table th, .table td {
      padding: 10px;
      text-align: center;
      border: 1px solid #2c3b55;
    }
    .table th {
      background-color: #1b2a41;
    }
    .table tr:nth-child(even) {
      background-color: #13243a;
    }
    .submit-button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 10px 20px;
      font-size: 18px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 20px;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h2>新建任务</h2>
        <div class="form-container">
          <label for="task-name">任务名:</label>
          <input type="text" id="task-name" />

          <label for="task-number">任务编号:</label>
          <input type="text" id="task-number" />

          <label for="location">所属地区:</label>
          <select id="location">
            <option>中卫</option>
          </select>

          <label for="device-type">设备类型:</label>
          <select id="device-type">
            <option>自动角反射器</option>
          </select>

          <label for="start-time">设备开启时间 (年-月-日 时:分:秒):</label>
          <input type="text" id="start-time" placeholder="2024-09-24 16:21:45"/>

          <label for="end-time">设备关闭时间 (年-月-日 时:分:秒):</label>
          <input type="text" id="end-time" placeholder="2024-09-24 16:21:45"/>

          <label for="execution-time">任务执行时间/分钟（整数）:</label>
          <input type="number" id="execution-time" />
        </div>

        <div>
          <h3>执行设备列表</h3>
          <table class="table">
            <thead>
              <tr>
                <th>设备安装角度</th>
                <th>设备调整角度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" /></td>
                <td><input type="text" /></td>
              </tr>
              <!-- 可在这里动态增加更多行 -->
            </tbody>
          </table>
        </div>

        <div class="form-container">
          <button class="add-button">+</button> <!-- 增加设备行按钮 -->
        </div>

        <div>
          <button class="submit-button">提交</button>
        </div>
      </div>
    `;
  }
}

customElements.define('task-create-component', TaskCreateComponent);
