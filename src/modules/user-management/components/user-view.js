import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-view.css?inline';

class UserView extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      mode: { type: String },
      userData: { type: Object }
    };
  }

  constructor() {
    super();
    this.mode = 'view';
    this.userData = {
      username: 'admin',
      password: 'yz147258369',
      phone: '13894417612',
      applyDate: '2024-10-9',
      country: '中国',
      region: '中卫',
      userType: '用户',
      reviewer: '',
      reviewTime: '',
      reviewOpinion: '同意',
      notes: ''
    };
  }

  // 渲染表单字段
  renderFormField(label, type, value, fieldName, placeholder = '', isReviewField = false) {
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
            @change=${e => this.handleInputChange(e, fieldName)}
          >
            <option value="同意" ?selected=${value === '同意'}>同意</option>
            <option value="不同意" ?selected=${value === '不同意'}>不同意</option>
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
                @input=${e => this.handleInputChange(e, fieldName)}
                placeholder=${placeholder}
              ></textarea>
            `
          : html`
              <input
                type="text"
                class="userInput"
                ?disabled=${isDisabled}
                .value=${value || ''}
                @input=${e => this.handleInputChange(e, fieldName)}
                placeholder=${placeholder}
              />
            `}
      </div>
    `;
  }

  handleInputChange(e, fieldName) {
    if (this.mode === 'view' || 
        ['username', 'password', 'phone', 'applyDate', 'country', 'region', 'userType'].includes(fieldName)) {
      return;
    }
    
    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value
    };
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>用户申请</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>
          <div class="user-info">
            <h3>用户信息</h3>
            ${this.renderFormField('用户名', 'text', this.userData.username, 'username')}
            ${this.renderFormField('密码', 'text', this.userData.password, 'password')}
            ${this.renderFormField('手机号', 'text', this.userData.phone, 'phone')}
            ${this.renderFormField('申请日期', 'text', this.userData.applyDate, 'applyDate')}
            ${this.renderFormField('国家', 'text', this.userData.country, 'country')}
            ${this.renderFormField('所属地区', 'text', this.userData.region, 'region')}
            ${this.renderFormField('用户类型', 'text', this.userData.userType, 'userType')}
          </div>
          
          <div class="review-info">
            ${this.renderFormField('审核人', 'text', this.userData.reviewer, 'reviewer', '', true)}
            ${this.renderFormField('审核时间', 'text', this.userData.reviewTime, 'reviewTime', '', true)}
            ${this.renderFormField('审核意见', 'select', this.userData.reviewOpinion, 'reviewOpinion', '', true)}
            ${this.renderFormField('备注', 'textarea', this.userData.notes, 'notes', '', true)}
            
            ${this.mode === 'review' 
              ? html`<button class="submit-button" @click=${this.handleSubmit}>确定</button>` 
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

  handleSubmit() {
    const reviewData = {
      reviewer: this.userData.reviewer,
      reviewTime: this.userData.reviewTime,
      reviewOpinion: this.userData.reviewOpinion,
      notes: this.userData.notes
    };

    this.dispatchEvent(new CustomEvent('submit', {
      detail: {
        userData: this.userData,
        reviewData
      }
    }));
  }
}

customElements.define('user-view', UserView);
