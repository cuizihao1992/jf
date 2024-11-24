import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-create-component.css?inline';
import { deviceService, taskService } from '@/api/fetch.js';

class TaskCreateComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      devices: { type: Array },
      selectedDevices: { type: Array },
      azimuth: { type: String },
      elevation: { type: String },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.selectedDevices = [];
    this.fetchDevices();
    this.azimuth = '0';
    this.elevation = '0';
    
    // 确保正确绑定事件处理方法
    this.handleAnglesUpdate = this.handleAnglesUpdate.bind(this);
  }

  async fetchDevices() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
      };
      const data = await deviceService.list(params);
      this.devices = data.rows.map((device) => ({
        ...device,
        currentAzimuth: device.currentAzimuth || '0',
        currentElevation: device.currentElevation || '0',
      }));
    } catch (error) {
      console.error('获取设备数据失败:', error);
    }
  }

  addSelectedDevices() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.device-status-table input[type="checkbox"]:checked'
    );

    checkboxes.forEach((checkbox) => {
      const deviceId = checkbox.getAttribute('id').replace('device-', '');
      const device = this.devices.find(
        (d) => String(d.id) === String(deviceId)
      );

      if (
        device &&
        !this.selectedDevices.some((d) => String(d.id) === String(deviceId))
      ) {
        this.selectedDevices = [
          ...this.selectedDevices,
          {
            ...device,
            angle: {
              horizontal: '0',
              elevation: '0'
            },
            originalAngle: {
              azimuth: '0',
              elevation: '0'
            }
          }
        ];
        checkbox.checked = false;
      }
    });

    this.requestUpdate();
  }

  removeSelectedDevices() {
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.device-list-table input[type="checkbox"]:checked'
    );
    const deviceIdsToRemove = Array.from(checkboxes).map((checkbox) =>
      checkbox.id.replace('device-', '')
    );
    this.selectedDevices = this.selectedDevices.filter(
      (device) => !deviceIdsToRemove.includes(device.id)
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  }

  handleLocation(location) {
    const coordinates = {
      中卫: [106.2, 37.5],
      嵩山: [112.5, 34.8],
    };

    // 触发位置选择事件
    this.dispatchEvent(
      new CustomEvent('location-selected', {
        detail: {
          location,
          coordinates: coordinates[location],
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const deviceStatusRows = this.devices.map(
      (device) => html`
        <tr>
          <td>
            <input
              type="checkbox"
              id="device-${device.id}"
              .value="${device.id}"
            />
            ${device.id}
          </td>
          <td>${device.region}</td>
          <td>${device.deviceType}</td>
          <td><button class="power-status">${device.powerStatus}</button></td>
          <td>${device.deviceStatus}</td>
          <td>${device.lastSyncTime}</td>
          <td>
            <button
              class="view-button colored-button"
              @click="${() => this.openStatusMission()}"
            >
              查看
            </button>
          </td>
        </tr>
      `
    );

    const deviceListTableRows = this.selectedDevices.map(device => {
        const angle = device.angle || { horizontal: '0', elevation: '0' };
        
        return html`
            <tr>
                <td>
                    <input 
                        type="checkbox" 
                        id="device-${device.id}" 
                        .value="${device.id}"
                    />
                    ${device.id}
                </td>
                <td>
                    方位角: ${device.currentAzimuth || '0'}° 
                    俯仰角: ${device.currentElevation || '0'}°
                </td>
                <td>
                    水平角:
                    <input 
                        type="text"
                        style="width: 40px;"
                        .value="${angle.horizontal}"
                        readonly
                    />°
                    俯仰角:
                    <input 
                        type="text"
                        style="width: 40px;"
                        .value="${angle.elevation}"
                        readonly
                    />°
                </td>
            </tr>
        `;
    });

    return html`
      <div class="container">
        <div class="header">
          <h1>新建任务</h1>
          <span class="close-button" @click="${this.closeModal}">×</span>
        </div>
        <div>
          <div class="task-info">
            <h2>任务信息</h2>
            <div class="row-task">
              <label for="task-name">任务名:</label>
              <input type="text" id="task-name" placeholder="请输入任务名" />
              <label for="task-number">任务编号:</label>
              <input
                type="text"
                id="task-number"
                placeholder="请输入任务编号"
              />
            </div>
            <div class="row-location">
              <label for="location">所属地区:</label>
              <select
                id="location"
                @change="${(e) => this.handleLocation(e.target.value)}"
              >
                <option value="中卫">中卫</option>
                <option value="嵩山">嵩山</option>
              </select>
              <label for="device-type">设备类型:</label>
              <select id="device-type">
                <option value="reflector">自动角反射器</option>
              </select>
            </div>
            <div class="form-group">
              <label for="start-time">设备开启时间/(年-月-日时-分-秒):</label>
              <input
                type="datetime-local"
                id="start-time"
                placeholder="请输入设备开启时间"
                @change="${() => this.calculateTime('start-time')}"
              />
            </div>
            <div class="form-group">
              <label for="end-time">设备关闭时间/(年-月-日时-分-秒):</label>
              <input
                type="datetime-local"
                id="end-time"
                placeholder="请输入设备关闭时间"
                @change="${() => this.calculateTime('end-time')}"
              />
            </div>
            <div class="form-group">
              <label for="execution-time">任务执行时间/秒(整数):</label>
              <input
                type="text"
                id="execution-time"
                placeholder="请输入任务执行时"
                @input="${() => this.calculateTime('execution-time')}"
              />
            </div>
          </div>
          <div class="device-list">
            <h3>执行设备列表</h3>
            <div class="tbody-wrapper">
              <table class="device-list-table">
                <thead>
                  <tr>
                    <th>设备编号</th>
                    <th>设备地理角度</th>
                    <th>设备调整角度</th>
                  </tr>
                </thead>
                <tbody>
                  ${deviceListTableRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="plus-minus">
          <button @click="${() => this.addSelectedDevices()}">+</button>
          <button @click="${() => this.removeSelectedDevices()}">-</button>
        </div>

        <div class="device-status">
          <h3>设备状态列表</h3>
          <div class="tbody-new-wrapper">
            <table class="device-status-table">
              <thead>
                <tr>
                  <th>设备编号</th>
                  <th>所属地区</th>
                  <th>设备类型</th>
                  <th>电源状态</th>
                  <th>设备状态</th>
                  <th>设备时间</th>
                  <th>任务状态</th>
                </tr>
              </thead>
              <tbody>
                ${deviceStatusRows}
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer-buttons">
          <button
            class="config-button"
            @click="${() => this.openParameterConfig()}"
          >
            配置参数
          </button>
          <button
            class="select-button"
            @click="${() => this.openScopeSelection()}"
          >
            范围选择
          </button>
          <button class="submit-button" @click="${this.submit}">提交</button>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openStatusMission() {
    this.dispatchEvent(new CustomEvent('open-status-mission'));
  }

  openParameterConfig() {
    const parameterConfig = document.createElement('parameter-config');
    
    // 获取选中的设备
    const checkedBoxes = this.shadowRoot.querySelectorAll(
        '.device-list-table input[type="checkbox"]:checked'
    );
    
    if (checkedBoxes.length === 0) {
        alert('请先选择需要计算的设备');
        return;
    }
    
    // 获取选中设备的数据
    const selectedDevicesData = Array.from(checkedBoxes).map(checkbox => {
        const deviceId = checkbox.getAttribute('id').replace('device-', '');
        return this.selectedDevices.find(device => String(device.id) === String(deviceId));
    }).filter(Boolean);

    // 将选中的设备数据传递给参数配置组件
    window.currentDeviceData = selectedDevicesData.map(device => ({
        id: device.id,
        currentAzimuth: device.currentAzimuth || '0',
        currentElevation: device.currentElevation || '0'
    }));

    // 监听多个设备的角度计算结果
    document.addEventListener('angles-calculated', (event) => {
        console.log('捕获到角度计算事件:', event.detail);
        this.handleAnglesUpdate(event);
    });

    this.dispatchEvent(
        new CustomEvent('open-parameter-config', {
            detail: { parameterConfig },
        })
    );
  }

  openScopeSelection() {
    this.dispatchEvent(new CustomEvent('open-scope-selection'));
  }

  updateAngle(deviceId, angleType, value) {
    this.selectedDevices = this.selectedDevices.map((device) => {
      if (device.id === deviceId) {
        return {
          ...device,
          angle: {
            ...device.angle,
            [angleType]: value,
          },
        };
      }
      return device;
    });
  }

  handleAnglesUpdate(e) {
    const { deviceId, azimuth, elevation } = e.detail;
    console.log('任务创建组件收到角度更新:', {
        设备ID: deviceId,
        方位角: azimuth,
        俯仰角: elevation
    });

    // 更新选中设备的角度
    this.selectedDevices = this.selectedDevices.map(device => {
        if (String(device.id) === String(deviceId)) {
            console.log('更新设备角度:', {
                设备ID: deviceId,
                新水平角: azimuth,
                新俯仰角: elevation
            });
            return {
                ...device,
                angle: {
                    horizontal: azimuth,
                    elevation: elevation
                }
            };
        }
        return device;
    });

    // 强制更新视图
    this.requestUpdate();
  }

  firstUpdated() {
    const parameterConfig = this.shadowRoot.querySelector('parameter-config');
    if (parameterConfig) {
      parameterConfig.addEventListener('update-device-angles', (e) => {
        this.azimuth = e.detail.azimuth;
        this.elevation = e.detail.elevation;
        this.requestUpdate();
      });
    }
  }

  calculateTime(changedInputId) {
    const startTimeInput = this.shadowRoot.querySelector('#start-time');
    const endTimeInput = this.shadowRoot.querySelector('#end-time');
    const executionTimeInput = this.shadowRoot.querySelector('#execution-time');

    if (changedInputId === 'execution-time' && startTimeInput.value && executionTimeInput.value) {
        // 当修改执行时间时
        const startTime = new Date(startTimeInput.value);
        const executionSeconds = parseInt(executionTimeInput.value);
        
        if (!isNaN(executionSeconds) && executionSeconds > 0) {
            // 计算结束时间 = 开始时间 + 执行时间
            const endTime = new Date(startTime.getTime() + (executionSeconds * 1000));
            // 格式化为datetime-local支持的格式 (YYYY-MM-DDThh:mm:ss)
            const formattedEndTime = new Date(endTime.getTime() - endTime.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19);
            endTimeInput.value = formattedEndTime;
        }
    } else if (changedInputId === 'start-time' || changedInputId === 'end-time') {
        // 当修改开始时间或结束时间时
        if (startTimeInput.value && endTimeInput.value) {
            const startTime = new Date(startTimeInput.value);
            const endTime = new Date(endTimeInput.value);
            
            // 计算时间差（秒）
            const timeDifference = Math.floor((endTime - startTime) / 1000);
            
            if (timeDifference > 0) {
                executionTimeInput.value = timeDifference;
            } else {
                executionTimeInput.value = '';
                this.showError('结束时间必须晚于开始时间');
            }
        }
    }
  }

  showError(message) {
    console.warn(message);
    // 可以添加更友好的错误提示，比如使用toast组件
    const event = new CustomEvent('show-toast', {
        detail: {
            message: message,
            type: 'error'
        },
        bubbles: true,
        composed: true
    });
    this.dispatchEvent(event);
  }

  async submit() {
    // 获取表单数据
    const taskName = this.shadowRoot.querySelector('#task-name').value;
    const taskNumber = this.shadowRoot.querySelector('#task-number').value;
    const location = this.shadowRoot.querySelector('#location').value;
    const deviceType = this.shadowRoot.querySelector('#device-type').value;
    const startTime = this.shadowRoot.querySelector('#start-time').value;
    const endTime = this.shadowRoot.querySelector('#end-time').value;
    const executionTime = this.shadowRoot.querySelector('#execution-time').value;

    // 验证必填字段
    if (!taskName || !taskNumber || !startTime || !endTime || !executionTime) {
      alert('请填写所有必填字段');
      return;
    }

    // 验证是否选择了设备
    if (this.selectedDevices.length === 0) {
      alert('请至少选择一个执行设备');
      return;
    }

    // 构建提交参数
    const param = {
      taskName,
      taskNumber,
      region: location,
      deviceType,
      startTime,
      endTime, 
      executionTime: parseInt(executionTime),
      deviceIds: this.selectedDevices.map(device => device.id).join(','),
      devices: this.selectedDevices.map(device => ({
        deviceId: device.id,
        // 使用计算后的差值角度
        targetAzimuth: device.angle.horizontal,
        targetElevation: device.angle.elevation,
        // 可以选择性地添加原始角度信息
        originalAzimuth: device.originalAngle?.azimuth,
        originalElevation: device.originalAngle?.elevation
      }))
    };

    try {
      // 调用任务创建API
      const response = await taskService.add(param);
      
      if (response.code === 200) {
        // 清除临时数据
        this.selectedDevices = [];
        
        // 触发任务���表更新事件
        window.dispatchEvent(new CustomEvent('tasks-updated', {
          detail: {
            task: response.data
          },
          bubbles: true,
          composed: true
        }));

        // 关闭弹窗
        this.dispatchEvent(new CustomEvent('close-modal'));
        
        // 显示成功提示
        alert('任务创建成功');
      } else {
        throw new Error(response.msg || '任务创建失败');
      }
    } catch (error) {
      console.error('任务创建失败:', error);
      alert('任务创建失败，请重试');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('angles-calculated', this.handleAnglesUpdate);
  }
}

customElements.define('task-create-component', TaskCreateComponent);
