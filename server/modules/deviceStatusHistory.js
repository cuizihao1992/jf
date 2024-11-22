const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_device_status_history';
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

  async add(statusData) {
    const { device_id, connection_status, device_status, power_status } =
      statusData;

    const query = `
      INSERT INTO jf_device_status_history 
      (device_id, connection_status, device_status, power_status) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      device_id,
      connection_status,
      device_status,
      power_status,
    ]);

    return result.insertId;
  },

  async delete(statusId) {
    const query = 'DELETE FROM jf_device_status_history WHERE status_id = ?';
    const [result] = await db.query(query, [statusId]);
    return result.affectedRows;
  },

  async update(statusId, statusData) {
    const fields = [];
    const values = [];

    Object.keys(statusData).forEach((key) => {
      if (statusData[key] !== undefined && statusData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(statusData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_device_status_history SET ${fields.join(', ')} WHERE status_id = ?`;
    values.push(statusId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
