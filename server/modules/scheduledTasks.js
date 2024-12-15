const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_scheduled_tasks';
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
    const { task_id, schedule_expression, next_run_time, is_active } = taskData;

    const query = `
      INSERT INTO jf_scheduled_tasks (task_id, schedule_expression, next_run_time, is_active) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      task_id,
      schedule_expression,
      next_run_time,
      is_active,
    ]);

    return result.insertId;
  },

  async delete(taskId) {
    const query = 'DELETE FROM jf_scheduled_tasks WHERE scheduled_task_id = ?';
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

    const query = `UPDATE jf_scheduled_tasks SET ${fields.join(', ')} WHERE scheduled_task_id = ?`;
    values.push(taskId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
