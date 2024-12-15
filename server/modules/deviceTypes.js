const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_device_types';
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

  async add(typeData) {
    const { type_name, description } = typeData;

    const query = `
      INSERT INTO jf_device_types (type_name, description) 
      VALUES (?, ?)
    `;

    const [result] = await db.query(query, [type_name, description]);
    return result.insertId;
  },

  async delete(typeId) {
    const query = 'DELETE FROM jf_device_types WHERE type_id = ?';
    const [result] = await db.query(query, [typeId]);
    return result.affectedRows;
  },

  async update(typeId, typeData) {
    const fields = [];
    const values = [];

    Object.keys(typeData).forEach((key) => {
      if (typeData[key] !== undefined && typeData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(typeData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_device_types SET ${fields.join(', ')} WHERE type_id = ?`;
    values.push(typeId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
