import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-approve.css?inline';
import { deviceReviewService } from '@/api/fetch.js';

class DeviceApprove extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      deviceReviews: { type: Array },
    };
  }

  constructor() {
    super();
    this.deviceReviews = [];
    this.fetchDeviceReviews();
  }

  async fetchDeviceReviews() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
      };
      const data = await deviceReviewService.list(params);
      this.deviceReviews = data.rows;
    } catch (error) {
      console.error('获取设备审核数据失败:', error);
    }
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备审批<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" style="background-color: gray;">
              <option>设备编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              style="background-color: white; "
            />
          </div>
          <button class="query-button" @click="${this.fetchDeviceReviews}">
            查询
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">审批类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>新增</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>已提交</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>设备名</th>
                <th>所属地区</th>
                <th>提交用户名</th>
                <th>审批类型</th>
                <th>设备类型</th>
                <th>审批状态</th>
                <th>申请时间</th>
                <th>操作</th>
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
    return this.deviceReviews.map(
      (review) => html`
        <tr class="table-row">
          <td>${review.deviceId}</td>
          <td>${review.region}</td>
          <td>${review.userName}</td>
          <td>${review.approveType}</td>
          <td>${review.deviceType}</td>
          <td>${review.reviewStatus}</td>
          <td>${review.createdTime}</td>
          <td>
            <a @click="${() => this.openDeviceParticulars(review, 'view')}"
              >查看</a
            >
            /
            <a @click="${() => this.openDeviceParticulars(review, 'review')}"
              >审核</a
            >
          </td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openDeviceParticulars(review, type) {
    this.dispatchEvent(
      new CustomEvent('open-device-particulars', {
        detail: {
          device: review,
          mode: {
            isEdit: false,
            isReview: true,
            isReviewEdit: type === 'review',
          },
          reviewData: {
            reviewer: review.reviewer || '',
            reviewTime: review.reviewTime || '',
            reviewOpinion: review.reviewOpinion || '',
            notes: review.notes || '',
          },
        },
      })
    );
  }
}

customElements.define('device-approve', DeviceApprove);
