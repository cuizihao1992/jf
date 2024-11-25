import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/fault-details.css?inline';
import api from '@/apis/api.js';

class FaultDetails extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
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
      const params = {};
      const data = await api.taskErrorsApi.query(params);
      this.faults = data; // 将获取的数据赋值给 faults
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
