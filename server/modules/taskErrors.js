const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_task_errors';
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

  async add(errorData) {
    const {
      task_id,
      error_code,
      error_message,
      timestamp,
      severity_level,
      resolution_status,
      resolution_time,
      resolved_by,
      device_id,
    } = errorData;

    const query = `
      INSERT INTO jf_task_errors 
      (
        task_id, error_code, error_message, timestamp, severity_level, 
        resolution_status, resolution_time, resolved_by, device_id
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      task_id,
      error_code,
      error_message,
      timestamp,
      severity_level,
      resolution_status,
      resolution_time,
      resolved_by,
      device_id,
    ]);

    return result.insertId;
  },

  async delete(errorId) {
    const query = 'DELETE FROM jf_task_errors WHERE error_id = ?';
    const [result] = await db.query(query, [errorId]);
    return result.affectedRows;
  },

  async update(errorId, errorData) {
    const fields = [];
    const values = [];

    Object.keys(errorData).forEach((key) => {
      if (errorData[key] !== undefined && errorData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(errorData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_task_errors SET ${fields.join(', ')} WHERE error_id = ?`;
    values.push(errorId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
