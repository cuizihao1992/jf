import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-view.css?inline';
import { format } from 'date-fns';
import api from '@/apis/api'; // 假设 api.userReviewApi.update 可用

class UserView extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      mode: { type: String },
      userData: { type: Object },
    };
  }

  constructor() {
    super();
    this.mode = 'view';
    this.userData = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.mode === 'review') {
      this.setCurrentReviewTime();
    }
  }

  // 设置当前审核时间为当前时间，格式为 yyyy-MM-dd HH:mm:ss
  setCurrentReviewTime() {
    const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.userData = {
      ...this.userData,
      reviewTime: currentTime,
    };
    this.requestUpdate();
  }

  // 添加日期格式化方法
  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (e) {
        return dateStr;
    }
  }

  // 修改 setUserData 方法
  setUserData(data) {
    if (!data) return;
    
    this.userData = {
      username: data.username || '',
      password: data.password || '',
      phone: data.phone || '',
      application_date: data.application_date || '',
      country: data.country || '',
      region: data.region || '',
      user_type: data.user_type || '',
      reviewer: data.reviewer || '',
      review_time: data.review_time || '',
      review_opinion: data.review_opinion || '',
      remarks: data.remarks || ''
    };
    this.requestUpdate();
  }

  // 渲染表单字段
  renderFormField(
    label,
    type,
    value,
    fieldName,
    placeholder = '',
    isReviewField = false
  ) {
    const isDisabled = !isReviewField || this.mode === 'view';

    // 为审核意见字段特殊处理
    if (fieldName === 'reviewOpinion') {
      return html`
        <div class="row">
          <label>${label}: </label>
          <select
            class="review-select"
            ?disabled=${isDisabled}
            .value=${value}
            @change=${(e) => this.handleInputChange(e, fieldName)}
          >
            <option value="同意" ?selected=${value === '同意'}>同意</option>
            <option value="不同意" ?selected=${value === '不同意'}>
              不同意
            </option>
          </select>
        </div>
      `;
    }

    return html`
      <div class="row">
        <label>${label}: </label>
        ${type === 'textarea'
          ? html`
              <textarea
                id=${fieldName}
                ?disabled=${isDisabled}
                .value=${value || ''}
                @input=${(e) => this.handleInputChange(e, fieldName)}
                placeholder=${placeholder}
              ></textarea>
            `
          : html`
              <input
                type="text"
                class="userInput"
                ?disabled=${isDisabled}
                .value=${value || ''}
                @input=${(e) => this.handleInputChange(e, fieldName)}
                placeholder=${placeholder}
              />
            `}
      </div>
    `;
  }

  handleInputChange(e, fieldName) {
    if (
      this.mode === 'view' ||
      [
        'username',
        'password',
        'phone',
        'applicationDate',
        'country',
        'region',
        'userType',
        'applicationType',
        'registrationTime',
        'userStatus',
      ].includes(fieldName)
    ) {
      return;
    }

    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value,
    };
  }

  async handleSubmit() {
    const reviewStatus =
      this.userData.reviewOpinion === '同意' ? 'approved' : 'rejected';
    const reviewData = {
      ...this.userData,
      reviewer: this.userData.reviewer,
      reviewStatus: reviewStatus,
    };

    try {
      // 调用更新接口
      await api.userReviewApi.update(reviewData.id, reviewData);
      this.dispatchEvent(
        new CustomEvent('submit', {
          detail: {
            userData: this.userData,
            reviewData,
          },
        })
      );
    } catch (error) {
      console.error('Error updating review:', error);
    }
  }

  render() {
    console.log('Current userData:', this.userData);
    
    if (!this.userData || Object.keys(this.userData).length === 0) {
      return html`<div class="container">
        <div class="header">
          <h1>用户申请</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>加载中...</div>
      </div>`;
    }

    return html`
      <div class="container">
        <div class="header">
          <h1>用户申请</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>
          <div class="user-info">
            <h3>用户信息</h3>
            ${this.renderFormField(
              '用户名',
              'text',
              this.userData.username,
              'username'
            )}
            ${this.renderFormField(
              '密码',
              'text',
              this.userData.password,
              'password'
            )}
            ${this.renderFormField(
              '手机号',
              'text',
              this.userData.phone,
              'phone'
            )}
            ${this.renderFormField(
              '申请日期',
              'text',
              this.userData.applicationDate,
              'applicationDate'
            )}
            ${this.renderFormField(
              '国家',
              'text',
              this.userData.country,
              'country'
            )}
            ${this.renderFormField(
              '所属地区',
              'text',
              this.userData.region,
              'region'
            )}
            ${this.renderFormField(
              '用户类型',
              'text',
              this.userData.userType,
              'userType'
            )}
          </div>

          <div class="review-info">
            ${this.renderFormField(
              '审核状态',
              'text',
              this.userData.reviewStatus,
              'reviewStatus',
              '',
              true
            )}
            ${this.renderFormField(
              '审核人',
              'text',
              this.userData.reviewer,
              'reviewer',
              '',
              true
            )}
            ${this.renderFormField(
              '审核时间',
              'text',
              this.userData.reviewTime,
              'reviewTime',
              '',
              true
            )}
            ${this.renderFormField(
              '审核意见',
              'select',
              this.userData.reviewOpinion,
              'reviewOpinion',
              '',
              true
            )}
            ${this.renderFormField(
              '备注',
              'textarea',
              this.userData.remarks,
              'remarks',
              '',
              true
            )}
            ${this.mode === 'review'
              ? html`<button class="submit-button" @click=${this.handleSubmit}>
                  确定
                </button>`
              : ''}
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('user-view', UserView);
