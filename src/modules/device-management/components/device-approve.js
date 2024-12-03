import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-approve.css?inline';
import api from '@/apis/api.js';

class DeviceApprove extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      deviceReviews: { type: Array },
      searchType: { type: String },
      searchCondition: { type: String },
      region: { type: String },
      deviceType: { type: String },
      reviewStatus: { type: String }
    };
  }

  constructor() {
    super();
    this.deviceReviews = [];
    this.searchType = 'id';
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    this.reviewStatus = '';
    
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.reviewStatusMap = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已拒绝'
    };

    this.reviewTypeMap = {
      'add': '新增',
      'edit': '编辑',
      'delete': '删除'
    };
    
    this.fetchDeviceReviews();
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleRegionChange(event) {
    this.region = event.target.value;
    this.fetchDeviceReviews(); // 直接触发查询
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
    this.fetchDeviceReviews(); // 直接触发查询
  }

  handleReviewStatusChange(event) {
    this.reviewStatus = event.target.value;
    this.fetchDeviceReviews(); // 直接触发查询
  }

  clearSearchCondition() {
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    this.reviewStatus = '';
    
    const locationSelect = this.shadowRoot.querySelector('#location');
    const deviceTypeSelect = this.shadowRoot.querySelector('#device-type');
    const reviewStatusSelect = this.shadowRoot.querySelector('#review-status');
    
    if (locationSelect) locationSelect.value = '';
    if (deviceTypeSelect) deviceTypeSelect.value = '';
    if (reviewStatusSelect) reviewStatusSelect.value = '';
    
    this.fetchDeviceReviews();
  }

  async fetchDeviceReviews() {
    try {
      const params = {};
      if (this.searchCondition) {
        if (this.searchType === 'id') {
          params.deviceId = this.searchCondition;
        } else if (this.searchType === 'name') {
          params.deviceName = this.searchCondition;
        } else if (this.searchType === 'userId') {
          params.userId = this.searchCondition;
        }
      }
      if (this.region) {
        params.region = this.regionToChineseMap[this.region] || this.region;
      }
      if (this.reviewStatus) {
        params.reviewStatus = this.reviewStatus;
      }
      if (this.deviceType) {
        params.reviewType = this.deviceType;
      }
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('查询参数:', params);
      const data = await api.deviceReviewsApi.query(params);
      console.log('获取到的数据:', data);
      this.deviceReviews = Array.isArray(data) ? data : [];
      this.requestUpdate();
    } catch (error) {
      console.error('获取设备审核数据失败:', error);
      this.deviceReviews = [];
      this.requestUpdate();
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
            <label for="search-type">查询方式:</label>
            <select id="search-type" @change="${this.handleSearchTypeChange}" .value="${this.searchType}">
              <option value="id">设备编号</option>
              <option value="name">设备名称</option>
              <option value="userId">用户名</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              .value="${this.searchCondition}"
              @input="${this.handleSearchConditionChange}"
            />
            <button class="clear-button" @click="${this.clearSearchCondition}">
              清除
            </button>
          </div>
          <button class="query-button" @click="${this.fetchDeviceReviews}">查询</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" @change="${this.handleRegionChange}" .value="${this.region}">
              <option value="">全部</option>
              <option value="zhongwei">中卫</option>
              <option value="songshan">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">审批类型:</label>
            <select id="device-type" @change="${this.handleDeviceTypeChange}" .value="${this.deviceType}">
              <option value="">全部</option>
              <option value="add">新增</option>
              <option value="edit">编辑</option>
              <option value="delete">删除</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select id="review-status" @change="${this.handleReviewStatusChange}" .value="${this.reviewStatus}">
              <option value="">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>设备编号</th>
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
          <td>${review.deviceId || '-'}</td>
          <td>${review.deviceName || '-'}</td>
          <td>${this.regionToChineseMap[review.region] || review.region || '-'}</td>
          <td>${review.userId || '-'}</td>
          <td>${this.reviewTypeMap[review.reviewType] || review.reviewType || '-'}</td>
          <td>${review.deviceType || '-'}</td>
          <td>${this.reviewStatusMap[review.reviewStatus] || review.reviewStatus || '-'}</td>
          <td>${review.createdTime || '-'}</td>
          <td>
            <a @click="${() => this.openDeviceParticulars(review, 'view')}">查看</a>
            /
            <a @click="${() => this.openDeviceParticulars(review, 'review')}">审核</a>
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
