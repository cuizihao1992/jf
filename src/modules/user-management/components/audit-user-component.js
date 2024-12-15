import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/audit-user.css?inline';
import api from '@/apis/api.js';

class AuditUserComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    applications: { type: Array },
    filteredApplications: { type: Array },
    userType: { type: String },
    region: { type: String },
    reviewStatus: { type: String },
    searchType: { type: String },
    searchCondition: { type: String },
  };

  constructor() {
    super();
    this.applications = [];
    this.filteredApplications = [];
    this.userType = '';
    this.region = '';
    this.reviewStatus = '';
    this.searchType = 'username';
    this.searchCondition = '';
    
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.userTypeToChineseMap = {
      'user': '用户',
      'admin': '管理员',
      'superAdmin': '超级管理员'
    };
    
    this.reviewStatusMap = {
      'submitted': '已提交',
      'approved': '已通过',
      'rejected': '已拒绝',
      'pending': '待审核'
    };
    
    this.applicationTypeMap = {
      'register': '注册',
      'modify': '修改',
      'delete': '删除'
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApplications();
  }

  async loadApplications() {
    try {
      const params = {
        username: this.searchType === 'username' ? this.searchCondition : undefined,
        phone: this.searchType === 'phone' ? this.searchCondition : undefined,
        userId: this.searchType === 'userId' ? this.searchCondition : undefined,
        userType: this.userTypeToChineseMap[this.userType] || this.userType,
        region: this.regionToChineseMap[this.region] || this.region,
        reviewStatus: this.reviewStatus
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.userReviewApi.query(params);
      this.applications = response;
      this.filteredApplications = [...this.applications];
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
    this.searchCondition = '';
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  onInputChange(event) {
    const { id, value } = event.target;
    const propertyName = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[propertyName] = value;
    this.loadApplications();
  }

  onClearClick() {
    this.searchType = 'username';
    this.searchCondition = '';
    this.userType = '';
    this.region = '';
    this.reviewStatus = '';
    this.loadApplications();
  }

  getReviewStatusInChinese(status) {
    const statusMap = {
      SUBMITTED: '已提交',
      APPROVED: '已通过',
      REJECTED: '已拒绝',
      PENDING: '待审核',
    };
    return statusMap[status] || status;
  }

  getReviewStatusOptions() {
    return [
      { value: 'SUBMITTED', label: '已提交' },
      { value: 'APPROVED', label: '已通过' },
      { value: 'REJECTED', label: '已拒绝' },
      { value: 'PENDING', label: '待审核' },
    ];
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          用户申请信息<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="search-section">
            <div class="form-group">
              <label for="search-type">查询类型:</label>
              <select 
                id="search-type" 
                .value="${this.searchType}"
                @change="${this.handleSearchTypeChange}"
              >
                <option value="username">用户名</option>
                <option value="phone">手机号</option>
                <option value="user_id">用户ID</option>
              </select>
            </div>
            <div class="search-condition-group">
              <label for="search-condition">查询条件:</label>
              <div class="input-with-buttons">
                <input
                  type="text"
                  id="search-condition"
                  .value="${this.searchCondition}"
                  @input="${this.handleSearchConditionChange}"
                />
                <button class="clear-button" @click="${this.onClearClick}">清除</button>
                <button class="query-button" @click="${this.loadApplications}">查询</button>
              </div>
            </div>
          </div>
          <hr />
          <div class="filter-section">
            <div class="form-group">
              <label for="user-type">用户类型:</label>
              <select
                id="user-type"
                .value="${this.userType}"
                @change="${this.onInputChange}"
              >
                <option value="">全部</option>
                <option value="user">用户</option>
                <option value="admin">管理员</option>
                <option value="superAdmin">超级管理员</option>
              </select>
            </div>
            <div class="form-group">
              <label for="region">所属地区:</label>
              <select
                id="region"
                .value="${this.region}"
                @change="${this.onInputChange}"
              >
                <option value="">全部</option>
                <option value="zhongwei">中卫</option>
                <option value="songshan">嵩山</option>
              </select>
            </div>
            <div class="form-group">
              <label for="review-status">审核状态:</label>
              <select
                id="review-status"
                .value="${this.reviewStatus}"
                @change="${this.onInputChange}"
              >
                <option value="">全部</option>
                <option value="submitted">已提交</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
                <option value="pending">待审核</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>用户名</th>
                <th>申请类型</th>
                <th>所属地区</th>
                <th>手机号</th>
                <th>用户类型</th>
                <th>申请时间</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredApplications.map(
                (application) => html`
                  <tr class="table-row">
                    <td>${application.username}</td>
                    <td>${this.applicationTypeMap[application.applicationType] || application.applicationType}</td>
                    <td>${this.regionToChineseMap[application.region] || application.region}</td>
                    <td>${application.phone}</td>
                    <td>${this.userTypeToChineseMap[application.userType] || application.userType}</td>
                    <td>${application.applicationDate}</td>
                    <td>
                      ${this.reviewStatusMap[application.reviewStatus] || application.reviewStatus}
                    </td>
                    <td>
                      <a
                        @click="${(e) => this.onViewClick(e, application)}"
                        data-mode="view"
                        >查看</a
                      >/
                      <a
                        @click="${(e) => this.onViewClick(e, application)}"
                        data-mode="review"
                        >审核</a
                      >
                    </td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  onViewClick(event, application) {
    const mode = event.target.getAttribute('data-mode');
    console.log('onViewClick triggered with application:', application);
    
    this.dispatchEvent(
        new CustomEvent('open-user-view', {
            detail: {
                mode,
                userData: application
            },
            bubbles: true,
            composed: true
        })
    );
  }

  getRegionLabel(region) {
    const regionMap = {
      'ZHONGWEI': '中卫',
      'SONGSHAN': '嵩山'
    };
    return regionMap[region] || region;
  }

  getUserTypeLabel(userType) {
    return userType;
  }
}

customElements.define('audit-user-component', AuditUserComponent);
