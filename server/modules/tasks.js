const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_tasks';
    const conditions = [];
    const values = [];
    delete filter.userInfo; // 移除用户信息，避免误用

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

    const query = `
      INSERT INTO jf_tasks 
      (
        task_number, task_name, user_id, device_ids, is_scheduled, is_retracted,
        created_time, start_time, end_time, review_status, reviewer,
        review_time, review_comments, event_type, event_description, 
        is_success, error_id, duration, region, device_type, task_status
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
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

    return result.insertId;
  },

  async delete(taskId) {
    const query = 'DELETE FROM jf_tasks WHERE task_id = ?';
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

    const query = `UPDATE jf_tasks SET ${fields.join(', ')} WHERE task_id = ?`;
    values.push(taskId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
