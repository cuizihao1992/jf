import { LitElement, html, css } from 'lit';

class DeviceQuery extends LitElement {
  constructor() {
    super();
  }

  static styles = css`
    /* 样式和之前相同 */
    .modal {
      position: fixed;
      top: 50%;
      left: 5%;
      transform: translate(0%, -50%);
      padding: 20px;
      background-color: #0b1527;
      color: white;
      border-radius: 8px;
      width: 800px;
      height: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }
    th, td {
      border: 1px solid #444;
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #1a2b4c;
    }
    td {
      background-color: #273d66;
    }
    .action {
      color: #007bff;
      cursor: pointer;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: red;
      color: white;
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
    }
  `;

  render() {
    return html`
      <div class="modal">
        <button class="close-btn" @click=${this.closeModal}>关闭</button>
        <h2>设备查询</h2>

        <!-- 设备表格 -->
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>设备时间</th>
              <th>设备类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>101</td>
              <td>2024-9-24 16:21:45</td>
              <td>自动角反射器</td>
              <td><span class="action" @click=${this.handlePostureAdjust}>姿态调整</span></td>
            </tr>
            <!-- 更多设备数据 -->
          </tbody>
        </table>
      </div>
    `;
  }

  handlePostureAdjust() {
    this.dispatchEvent(new CustomEvent('open-posture-adjust')); // 发出打开姿态调整的事件
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal')); // 发出关闭设备查询的事件
  }
}

customElements.define('device-query', DeviceQuery);
