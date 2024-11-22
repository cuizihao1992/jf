const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_device_task';
    const conditions = [];
    const values = [];

    Object.keys(filter).forEach((key) => {
      if (filter[key] !== undefined && filter[key] !== null) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
    });

    const query = conditions.length
      ? `${baseQuery} WHERE ${conditions.join(' AND ')}`
      : baseQuery;

    const [rows] = await db.query(query, values);
    return rows;
  },

  async add(taskData) {
    const {
      task_id,
      user_id,
      device_id,
      install_azimuth,
      install_elevation,
      target_azimuth,
      target_elevation,
      adjustment_azimuth,
      adjustment_elevation,
      start_time,
      end_time,
      is_success,
      failure_reason,
    } = taskData;

    const query = `
      INSERT INTO jf_device_task 
      (task_id, user_id, device_id, install_azimuth, install_elevation, target_azimuth, target_elevation, adjustment_azimuth, adjustment_elevation, start_time, end_time, is_success, failure_reason) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      task_id,
      user_id,
      device_id,
      install_azimuth,
      install_elevation,
      target_azimuth,
      target_elevation,
      adjustment_azimuth,
      adjustment_elevation,
      start_time,
      end_time,
      is_success,
      failure_reason,
    ]);

    return result.insertId;
  },

  async delete(taskId) {
    const query = 'DELETE FROM jf_device_task WHERE device_task_id = ?';
    const [result] = await db.query(query, [taskId]);
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

    const query = `UPDATE jf_device_task SET ${fields.join(', ')} WHERE device_task_id = ?`;
    values.push(taskId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
