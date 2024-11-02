import { LitElement, html, css } from 'lit';

class deviceShenpi extends LitElement {
  static styles = css`
  .container {
      position: absolute;
    left: calc(40% + 160px);
    top: 14.4%;
      width: 340px; /* 增加整体宽度 */
      height: 670px; /* 设置高度为窗口高度 */
      padding: 15px; /* 内边距 */
      background-color: rgba(13, 31, 51, 0.9); /* 深色背景 */
      color: white;
    font-family: Arial, sans-serif;
    border-radius: 10px; /* 圆角 */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    gap: 10px; /* 缩短间距 */
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
  }

  .header h1 {
    margin: 1px;
    font-size: 24px; /* 字体大小 */
  }
  .close-button {
    cursor: pointer;
    font-size: 30px; /* 字体大小 */
    margin-right: 5px; /* 将叉号推到右侧 */
  }

  .plus-minus {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    align-items: center; /* 水平居中 */
    position:deliver;
    margin-right:45px;
  }
  .plus-minus button {
    background-color: #58a6ff;
    border: none;
    color: white;
    font-size: 44px; /* 字体大小 */
    padding: 0px; /* 内边距 */
    cursor: pointer;
    border-radius: 5px;
    margin: 90px 0; /* 上下间距 */
    width: 25px;
    height: 80px;
    margin-left: 5px;
  
  }

  .button-group {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    align-items: center;
    margin-top: 15px; /* 上边距 */
  }
 
  .submit-button {
    width: 50px;
    height: 30px;
    align-self: center;
  }
  .footer-buttons {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    align-items: center;
    margin-top: -90px; 
  }
  select{
    width:100px;
    font-size:12px;
    text-align: center; 
    }
  input{
    font-size:14px;
    text-align: center;
    }
  .review-info {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #58a6ff;
    border-radius: 5px;
    height: 260px;
  }
  .review-info .row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 290px;
  }
  .review-info label {
    color: white;
    width: 80px;
    font-size: 14px;
  }
  .review-info input{
    border: 1px solid #333;
    width: 150px;
    color: #000;
    text-align: center;
    margin-left:-35px;
    height: 24px;
    margin-left: 31px;
    border-radius: 5px;
  }
  .review-info textarea {
    width:150px;
    height: 100px;
    margin-left: 31px;
    border-radius: 5px;
  }
  .user-info {
    padding: 10px;
    border: 1px solid #58a6ff;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .user-info .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .user-info label {
    width: 100px;
  }

  .user-info span {
    flex: 1;
    text-align: left;
  }
.userInput{
    border: 1px solid #333;
    width: 150px;
    color: #000;
    margin-left:-35px;
    height: 24px;
    margin-right: 50px;
    border-radius: 5px;
  }
  .userSelect{
    border: 1px solid #333;
    width: 150px;
    color: #000;
    text-align: center;
    height: 24px;
    margin-right: 56px;
    border-radius: 5px;
    font-size: 14px;
  }
  h3{
    font-size: 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid #58a6ff;
    text-align: left;
    padding-bottom: 8px;
    margin-top: 0px;
  }
  .confirm-button {
    background-color: #4CAF50;
    color: white;
    padding: 5px 5px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    width: 60px;
    margin-left: 207px;
  }

`;

render() {
return html`
    <div class="container">
      <div class="header">
        <h1>设备审批</h1>
        <span class="close-button" @click="${this.handleClose}">×</span>
      </div>
      <div>
 
    <div class="user-info">
      <h3>设备信息</h3>
      <div class="row">
        <label>设备编号: </label>
        <input type="text" class="userInput" id="task-name"  placeholder="中卫101">
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
         <input type="text" class="userInput" id="task-name">
      </div>
      <div class="row">
        <label>安装方向角度: </label>
      <input type="text" class="userInput" id="task-name">          
      </div>
      <div class="row">
        <label>安装俯仰角度: </label>
         <input type="text" class="userInput" id="task-name">
      </div>
      <div class="row">
        <label>设备所在纬度: </label>
         <input type="text" class="userInput" id="task-name">
      </div>
      <div class="row">
        <label>设备所在经度: </label>
         <input type="text" class="userInput" id="task-name">
      </div>
    </div>
    <div class="review-info">
      <div class="row">
        <label for="reviewer">审核人:</label>
        <input type="text" id="reviewer" />
      </div>
      <div class="row">
         <label for="review-time">审核时间:</label>
         <input type="text" id="review-time">
      </div>
      <div class="row">
         <label for="review-opinion">审核意见:</label>
         <input type="text" id="review-opinion">
       </div>
      <div class="row" >
         <label for="notes" >备注:</label>
         <textarea id="notes" placeholder=""></textarea>
       </div>
      <button class="confirm-button" @click="${this.handleClose}">确定</button>
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


customElements.define('device-shenpi', deviceShenpi);