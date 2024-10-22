import { LitElement, html, css } from 'lit';
import '../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../components/shared-styles.js'; // 引入共享样式

class TaskManagement extends LitElement {
  static styles = [sharedStyles];
  render() {
    return html`
      <custom-button label="新建任务" @button-click=${this.createTask}></custom-button>
      <custom-button label="我的任务" @button-click=${this.myTasks}></custom-button>
      <custom-button label="任务查询" @button-click=${this.queryTasks}></custom-button>
    `;
  }

  createTask() {
    console.log('Create task clicked');
    // Logic for creating a new task
  }

  myTasks() {
    console.log('My tasks clicked');
    // Logic for handling "My Tasks"
  }

  queryTasks() {
    console.log('Query tasks clicked');
    // Logic for querying tasks
  }
}

customElements.define('task-management', TaskManagement);
