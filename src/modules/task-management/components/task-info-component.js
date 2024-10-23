import { LitElement, html, css } from "lit";

class TaskInfoComponent extends LitElement {
  static styles = css`
    .container {
      background-color: #0d1f33;
      color: white;
      padding: 20px;
      font-family: Arial, sans-serif;
      border-radius: 10px;
      position: absolute;
      left: 100px;
      top: 0;
      width: max-content;
    }
    h2 {
      margin: 0;
      padding-bottom: 10px;
    }
    .form-container {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .form-container label {
      margin-right: 10px;
    }
    .form-container select,
    input,
    button {
      margin-right: 10px;
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 10px;
      text-align: center;
      border: 1px solid #2c3b55;
    }
    th {
      background-color: #1b2a41;
    }
    tr:nth-child(even) {
      background-color: #13243a;
    }
    a {
      color: #58a6ff;
      text-decoration: none;
      margin-right: 5px;
    }
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: red;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 5px;
    }
  `;

  render() {
    return html`
      <div class="container">
        <button class="close-button" @click=${this._closeComponent}>
          关闭
        </button>
        <h2>任务信息</h2>
        <div class="form-container">
          <label for="search-type">任务查询方式:</label>
          <select id="search-type">
            <option>任务编号</option>
          </select>
          <input type="text" placeholder="查询条件" />
          <button>查询</button>
        </div>

        <div class="form-container">
          <label for="location">所属地区:</label>
          <select id="location">
            <option>中卫</option>
          </select>

          <label for="device-type">设备类型:</label>
          <select id="device-type">
            <option>自动角反射器</option>
          </select>

          <label for="status">审核状态:</label>
          <select id="status">
            <option>已提交</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>任务名</th>
              <th>任务编号</th>
              <th>提交用户名</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>审核状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>中卫101</td>
              <td>w101</td>
              <td>Y101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>已提交</td>
              <td>
                <a href="#">查看</a>
                <a href="#">编辑</a>
                <a href="#">撤回</a>
              </td>
            </tr>
            <tr>
              <td>中卫102</td>
              <td>w102</td>
              <td>Y101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>已提交</td>
              <td>
                <a href="#">查看</a>
                <a href="#">编辑</a>
                <a href="#">撤回</a>
              </td>
            </tr>
            <tr>
              <td>中卫103</td>
              <td>w103</td>
              <td>Y101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>已提交</td>
              <td>
                <a href="#">查看</a>
                <a href="#">编辑</a>
                <a href="#">撤回</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  _closeComponent() {
    // 触发自定义事件 'close-task-info'，让父组件知道要关闭该组件
    this.dispatchEvent(
      new CustomEvent("close-task-info", {
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("task-info-component", TaskInfoComponent);
