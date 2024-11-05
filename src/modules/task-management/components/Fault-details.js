import { LitElement, html, css } from 'lit';
import { errorService } from '@/api/fetch.js'; // 引入 errorService

class FaultDetails extends LitElement {
  static styles = css`
    .modal {
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
  static get properties() {
    return {
      faults: { type: Array }, // 添加 faults 属性
    };
  }

  constructor() {
    super();
    this.faults = []; // 初始化 faults
    this.fetchFaults(); // 在构造函数中调用 fetchFaults
  }

  async fetchFaults() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
      };
      const data = await errorService.list(params);
      this.faults = data.rows; // 将获取的数据赋值给 faults
    } catch (error) {
      console.error('获取故障列表失败:', error);
    }
  }
  render() {
    return html`
      <div class="modal">
        <div class="header">
          故障列表<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
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
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderRows() {
    return this.faults.map(
      (fault) => html`
        <tr class="table-row">
          <td>${fault.taskId}</td>
          <td>${fault.typeName}</td>
          <td>${fault.regionName}</td>
          <td>${fault.errorMessage}</td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('fault-details', FaultDetails);
