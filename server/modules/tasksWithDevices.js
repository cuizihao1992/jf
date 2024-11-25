const tasks = require('./tasks');
const deviceTasks = require('./deviceTasks');

module.exports = {
  /**
   * 查询任务及其关联的设备任务
   * @param {Object} filter - 查询任务的条件
   * @returns {Promise<Array>} - 包含任务及其设备任务的数组
   */
  async query(filter) {
    const taskList = await tasks.query(filter); // 获取任务列表

    for (const task of taskList) {
      const deviceTaskFilter = { task_id: task.task_id };
      const deviceTasksForTask = await deviceTasks.query(deviceTaskFilter); // 获取设备任务
      task.devices = deviceTasksForTask; // 将设备任务关联到任务
    }

    return taskList;
  },

  /**
   * 添加任务及其设备任务
   * @param {Object} taskData - 任务数据，包含设备任务的数组
   * @returns {Promise<number>} - 新增任务的 ID
   */
  async add(taskData) {
    const { devices, ...taskDetails } = taskData; // 分离任务和设备任务数据

    // 插入任务数据
    const taskId = await tasks.add(taskDetails);

    // 插入关联的设备任务
    if (devices && devices.length) {
      for (const deviceTask of devices) {
        await deviceTasks.add({ ...deviceTask, task_id: taskId });
      }
    }

    return taskId;
  },

  /**
   * 删除任务及其设备任务
   * @param {number} taskId - 任务 ID
   * @returns {Promise<number>} - 受影响的行数
   */
  async delete(taskId) {
    const deviceTaskFilter = { task_id: taskId };
    const deviceTasksForTask = await deviceTasks.query(deviceTaskFilter); // 获取设备任务

    if (deviceTasksForTask) {
      for (const deviceTask of deviceTasksForTask) {
        await deviceTasks.delete(deviceTask.device_task_id);
      }
    }

    // 删除任务
    const affectedRows = await tasks.delete(taskId);

    return affectedRows;
  },

  /**
   * 更新任务及其设备任务
   * @param {number} taskId - 任务 ID
   * @param {Object} taskData - 更新的数据，包括设备任务
   * @returns {Promise<number>} - 受影响的行数
   */
  async update(taskId, taskData) {
    const { devices, ...taskDetails } = taskData; // 分离任务和设备任务数据

    // 更新任务信息
    const affectedRows = await tasks.update(taskId, taskDetails);

    // 如果包含设备任务数据，先删除旧的设备任务，再新增
    const deviceTaskFilter = { task_id: taskId };
    const deviceTasksForTask = await deviceTasks.query(deviceTaskFilter); // 获取设备任务

    if (deviceTasksForTask) {
      for (const deviceTask of deviceTasksForTask) {
        await deviceTasks.delete(deviceTask.device_task_id);
      }
    }
    if (devices) {
      for (const deviceTask of devices) {
        await deviceTasks.add({ ...deviceTask, task_id: taskId });
      }
    }

    return affectedRows;
  },
};
