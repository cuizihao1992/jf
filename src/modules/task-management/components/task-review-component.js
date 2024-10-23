import { LitElement, html, css } from 'lit';

class TaskReviewComponent extends LitElement {
  static styles = css`
    .container {
      position: absolute;
      left: 50px;
      top: 50px;
      width: 950px;
      padding: 20px;
      background-color: #0d1f33;
      color: white;
      font-family: Arial, sans-serif;
      border: 1px solid rgba(42, 130, 228, 1);
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    }
    h2 {
      margin: 0;
      padding-bottom: 10px;
      text-align: left;
    }
       .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
    }
    .form-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    .form-group label {
      margin-right: 10px;
      white-space: nowrap;
    }
    .form-group select,
    .form-group input {
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
    }
    .query-button {
      padding: 8px 15px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
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
    .review-button {
      color: yellow;
    }
  `;
  closeWindow() {
    this.shadowRoot.querySelector('.container').style.display = 'none';
  }
  render() {
    return html`
        <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>审核列表</h2>
          <button class="close-button" @click="${this.closeWindow}">×</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>任务编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input type="text" id="search-condition" style="background-color: white; " />
          </div>
          <button class="query-button">查询</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审核状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>已提交</option>
            </select>
          </div><hr />
        </div>

        <table> 
          <thead>
            <tr>
              <th>任务名</th>
              <th>任务编号</th>
              <th>提交用户名</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>任务提交时间</th>
              <th>审核状态</th>
              <th>任务审核</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>中卫101</td>
              <td>w101</td>
              <td>Y101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>2024-11-05 23:00</td>
              <td>已提交</td>
              <td>
                <a href="#" class="review-button">查看/审核</a>
              </td>
            </tr>
             
            
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('task-review-component', TaskReviewComponent);
