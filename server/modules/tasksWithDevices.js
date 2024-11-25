const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const taskBaseQuery = 'SELECT * FROM jf_tasks';
    const taskConditions = [];
    const taskValues = [];

    Object.keys(filter).forEach((key) => {
      if (filter[key] !== undefined && filter[key] !== null) {
        taskConditions.push(`${key} = ?`);
        taskValues.push(filter[key]);
      }
    });

    const taskQuery = taskConditions.length
      ? `${taskBaseQuery} WHERE ${taskConditions.join(' AND ')}`
      : taskBaseQuery;

    const [tasks] = await db.query(taskQuery, taskValues);

    // 查询每个任务的设备任务
    for (const task of tasks) {
      const deviceTaskQuery = 'SELECT * FROM jf_device_task WHERE task_id = ?';
      const [deviceTasks] = await db.query(deviceTaskQuery, [task.task_id]);
      task.device_tasks = deviceTasks; // 添加设备任务到任务数据
    }

    return tasks;
  },

  async add(taskData) {
    // 新建任务
    const taskQuery = `
      INSERT INTO jf_tasks 
      (
        task_number, task_name, user_id, device_ids, is_scheduled, is_retracted,
        created_time, start_time, end_time, review_status, reviewer,
        review_time, review_comments, event_type, event_description, 
        is_success, error_id, duration, region, device_type, task_status
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const {
      task_number,
      task_name,
      user_id,
      device_ids,
      is_scheduled,
      is_retracted,
      created_time,
      start_time,
      end_time,
      review_status,
      reviewer,
      review_time,
      review_comments,
      event_type,
      event_description,
      is_success,
      error_id,
      duration,
      region,
      device_type,
      task_status,
    } = taskData;

    const [taskResult] = await db.query(taskQuery, [
      task_number,
      task_name,
      user_id,
      device_ids,
      is_scheduled,
      is_retracted,
      created_time,
      start_time,
      end_time,
      review_status,
      reviewer,
      review_time,
      review_comments,
      event_type,
      event_description,
      is_success,
      error_id,
      duration,
      region,
      device_type,
      task_status,
    ]);

    const taskId = taskResult.insertId;

    // 新建对应的设备任务
    const deviceIds = device_ids.split(',');
    const deviceTaskQuery = `
      INSERT INTO jf_device_task 
      (task_id, user_id, device_id, region) 
      VALUES (?, ?, ?, ?)
    `;

    for (const deviceId of deviceIds) {
      await db.query(deviceTaskQuery, [taskId, user_id, deviceId, region]);
    }

    return taskId;
  },

  async delete(taskId) {
    // 删除设备任务
    const deleteDeviceTaskQuery =
      'DELETE FROM jf_device_task WHERE task_id = ?';
    await db.query(deleteDeviceTaskQuery, [taskId]);

    // 删除任务
    const deleteTaskQuery = 'DELETE FROM jf_tasks WHERE task_id = ?';
    const [result] = await db.query(deleteTaskQuery, [taskId]);

    return result.affectedRows;
  },

  async update(taskId, taskData) {
    const fields = [];
    const values = [];

    Object.keys(taskData).forEach((key) => {
      if (taskData[key] !== undefined && taskData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(taskData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const updateTaskQuery = `UPDATE jf_tasks SET ${fields.join(', ')} WHERE task_id = ?`;
    values.push(taskId);

    const [result] = await db.query(updateTaskQuery, values);

    // 如果更新包含 device_ids，更新设备任务
    if (taskData.device_ids) {
      const deviceIds = taskData.device_ids.split(',');

      // 删除旧设备任务
      const deleteDeviceTaskQuery =
        'DELETE FROM jf_device_task WHERE task_id = ?';
      await db.query(deleteDeviceTaskQuery, [taskId]);

      // 添加新设备任务
      const addDeviceTaskQuery = `
        INSERT INTO jf_device_task 
        (task_id, user_id, device_id, region) 
        VALUES (?, ?, ?, ?)
      `;

      for (const deviceId of deviceIds) {
        await db.query(addDeviceTaskQuery, [
          taskId,
          taskData.user_id,
          deviceId,
          taskData.region,
        ]);
      }
    }

    return result.affectedRows;
  },
};
