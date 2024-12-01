import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-view.css?inline';
import api from '@/apis/api.js';

class UserView extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      mode: { type: String },
      userData: { type: Object },
      isSubmitting: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.mode = 'view';
    this.userData = {};
    this.isSubmitting = false;
  }

  // 添加这个方法来接收外部传入的数据
  setData(data) {
    console.log('Received data:', data);
    if (!data || !data.userData) return;
    
    this.mode = data.mode;
    this.userData = {
        ...data.userData,
        application_date: this.formatDate(data.userData.application_date)
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
        ['username', 'password', 'phone', 'application_date', 'country', 'region', 'user_type'].includes(fieldName)) {
      return;
    }
    
    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value
    };
  }

  // 修改渲染方法，添加数据检查
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
            ${this.renderFormField('用户名', 'text', this.userData.username || '', 'username')}
            ${this.renderFormField('密码', 'text', this.userData.password || '', 'password')}
            ${this.renderFormField('手机号', 'text', this.userData.phone || '', 'phone')}
            ${this.renderFormField('申请日期', 'text', this.userData.application_date || '', 'applicationDate')}
            ${this.renderFormField('国家', 'text', this.userData.country || '', 'country')}
            ${this.renderFormField('所属地区', 'text', this.userData.region || '', 'region')}
            ${this.renderFormField('用户类型', 'text', this.userData.user_type || '', 'userType')}
          </div>
          
          <div class="review-info">
            ${this.renderFormField('审核人', 'text', this.userData.reviewer || '', 'reviewer', '', true)}
            ${this.renderFormField('审核时间', 'text', this.userData.review_time || '', 'reviewTime', '', true)}
            ${this.renderFormField('审核意见', 'select', this.userData.review_opinion || '', 'reviewOpinion', '', true)}
            ${this.renderFormField('备注', 'textarea', this.userData.remarks || '', 'remarks', '', true)}
            
            ${this.mode === 'review' 
              ? html`
                  <button 
                    class="submit-button" 
                    @click=${this.handleSubmit}
                    ?disabled=${this.isSubmitting}
                  >
                    ${this.isSubmitting ? '提交中...' : '确定'}
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

  handleSubmit() {
    this.submitReview();
  }

  // 修改提交方法，添加更好的错误处理和加载状态
  async submitReview() {
    try {
      if (!this.userData.reviewer || !this.userData.review_opinion) {
        throw new Error('请填写审核人和审核意见');
      }

      const reviewData = {
        username: this.userData.username,
        reviewer: this.userData.reviewer,
        review_time: new Date().toISOString(),
        review_opinion: this.userData.review_opinion,
        remarks: this.userData.remarks
      };

      this.isSubmitting = true;
      this.requestUpdate();

      const response = await api.userReviewApi.review(reviewData);
      
      if (!response.success) {
        throw new Error(response.message || '提交失败');
      }

      this.dispatchEvent(new CustomEvent('refresh-list', {
        bubbles: true,
        composed: true
      }));
      
      this.showMessage('提交成功');
      this.handleClose();
    } catch (error) {
      console.error('提交审核失败:', error);
      this.showMessage(`提交失败: ${error.message}`);
    } finally {
      this.isSubmitting = false;
      this.requestUpdate();
    }
  }

  // 添加消息提示方法
  showMessage(message) {
    // 触发一个消息事件，让父组件处理消息显示
    this.dispatchEvent(new CustomEvent('show-message', {
      detail: { message },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('user-view', UserView);
