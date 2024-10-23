import { LitElement, html, css } from 'lit';

class TaskQueryComponent extends LitElement {
  static styles = css`
    .container {
      position: absolute;
      left: 50px; /* 控制与左边的距离 */
      top: 50px;  /* 控制与顶部的距离 */
      width: 900px; /* 设置合适的宽度 */
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
      align-items: center;
      margin-bottom: 20px;
      justify-content: space-between;
    }
    .form-container label {
      margin-right: 10px;
    }
    .form-container select, input, button {
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
      margin-top: 20px;
    }
    th, td {
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
    }
    .query-button {
      padding: 8px 15px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h2>任务查询</h2>
        <div class="form-container">
          <label for="search-type">任务查询方式:</label>
          <select id="search-type">
            <option>任务编号</option>
          </select>

          <label for="search-condition">查询条件:</label>
          <input type="text" id="search-condition" placeholder="请输入查询条件" />

          <label for="location">所属地区:</label>
          <select id="location">
            <option>中卫</option>
          </select>

          <label for="device-type">设备类型:</label>
          <select id="device-type">
            <option>自动角反射器</option>
          </select>

          <label for="task-status">任务状态:</label>
          <select id="task-status">
            <option>执行完成</option>
          </select>

          <button class="query-button">查询</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>任务名</th>
              <th>任务编号</th>
              <th>提交用户名</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>任务状态</th>
              <th>审核人员</th>
              <th>任务详情</th>
              <th>故障列表</th>
              <th>日志详情</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>中卫101</td>
              <td>w101</td>
              <td>Y101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>执行完成</td>
              <td>adminzw</td>
              <td><a href="#">查看</a></td>
              <td><a href="#">查看</a></td>
              <td><a href="#">查看</a></td>
            </tr>
            <!-- 其他数据行可以在此添加 -->
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('task-query-component', TaskQueryComponent);
