import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-review.css?inline';
import { reviewService } from '@/api/fetch.js';

class deviceReview extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  static get properties() {
    return {
      reviews: { type: Array },
      showConfirmation: { type: Boolean },
      searchType: { type: String },
      searchCondition: { type: String },
      reviewStatus: { type: String },
    };
  }

  constructor() {
    super();
    this.reviews = [];
    this.showConfirmation = false;
    this.searchType = 'taskNumber'; // 默认查询类型为任务编号
    this.searchCondition = ''; // 查询条件初始化为空
    this.reviewStatus = ''; // 审批状态初始化为空
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        [this.searchType]: this.searchCondition, // 动态属性查询
        reviewStatus: this.reviewStatus, // 审批状态过滤
      };
      const data = await taskService.list(params);
      this.tasks = data.rows;
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleReviewStatusChange(event) {
    this.reviewStatus = event.target.value;
  }

  clearSearchCondition() {
    this.searchCondition = '';
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>审批详情</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>
          <div class="user-info">
            <h3>设备信息</h3>
            <div class="row">
              <label>设备编号: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="中卫101"
              />
            </div>
            <div class="row">
              <label>所属地区: </label>
              <select class="userSelect" id="task-name">
                <option value="中卫">中卫</option>
              </select>
            </div>
            <div class="row">
              <label>设备类型: </label>
              <select class="userSelect" id="task-name">
                <option value="自动角反射器">自动角反射器</option>
              </select>
            </div>
            <div class="row">
              <label>偏磁角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>安装方向角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>安装俯仰角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>设备所在纬度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>设备所在经度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
          </div>
          <div class="review-info">
            <div class="row">
              <label for="reviewer">审核人:</label>
              <input type="text" id="reviewer" />
            </div>
            <div class="row">
              <label for="review-time">审核时间:</label>
              <input type="text" id="review-time" />
            </div>
            <div class="row">
              <label for="review-opinion">审核意见:</label>
              <input type="text" id="review-opinion" />
            </div>
            <div class="row">
              <label for="notes">备注:</label>
              <textarea id="notes" placeholder=""></textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-review', deviceReview);
