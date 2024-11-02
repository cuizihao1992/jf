import { LitElement, html, css } from "lit";

class FaultDetails extends LitElement {
  static styles = css`
    .modal {
      top: 15.3%;
      left: calc(50% + 300px);
      position: fixed; 
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 590px;
      height: 700px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(42, 130, 228, 1);
      background-size: cover;
      background-position: center;
    }

    .header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    th {
      background-color: #1a2b4c;
      padding: 8px;
      text-align: center;
      border-bottom: 2px solid #444;
    }

    .table-row {
      border-bottom: 1px solid #444;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    td {
      padding: 8px;
      text-align: center;
    }
    .table-container {
      max-height: 640px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }       
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">故障列表<button class="close-button" @click="${this.closeModal}">×</button></div>
        <hr>
        <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>设备类型</th>
              <th>所属地区</th>
              <th>故障情况</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <tr class="table-row">
              <td>101</td>
              <td>自动角反射器</td>
              <td>中卫</td>
              <td>设备电源故障</td>
            </tr>
            <!-- Add more fault rows as needed -->
          </tbody>
        </table>
      </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define("fault-details", FaultDetails);