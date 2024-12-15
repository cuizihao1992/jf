const db = require('./mysql.js');

module.exports = {
  // 动态查询日志
  async query(filter) {
    const baseQuery = `
      SELECT 
        jf_command_logs.* 
      FROM 
        jf_command_logs
    `;

    const conditions = [];
    const values = [];

    // 遍历 filter 对象，生成查询条件
    Object.keys(filter).forEach((key) => {
      if (filter[key] !== undefined && filter[key] !== null) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
    });

    // 如果有条件，拼接 WHERE 子句
    const query = conditions.length
      ? `${baseQuery} WHERE ${conditions.join(' AND ')}`
      : baseQuery;

    // 执行查询
    const [rows] = await db.query(query, values);
    return rows;
  },

  // 新增日志
  async add(logData) {
    const {
      addr,
      command,
      type,
      value,
      success,
      result,
      result_value,
      status,
      image,
      send_time,
      receive_time,
      create_time,
    } = logData;

    const query = `
      INSERT INTO jf_command_logs 
      (addr, command, type, value, success, result, result_value, status, image, send_time, receive_time, create_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result0] = await db.query(query, [
      addr,
      command,
      type,
      value,
      success,
      result,
      result_value,
      status,
      image,
      send_time,
      receive_time,
      create_time,
    ]);

    return result0.insertId; // 返回新插入记录的 ID
  },

  // 删除日志
  async delete(logId) {
    const query = 'DELETE FROM jf_command_logs WHERE id = ?';
    const [result] = await db.query(query, [logId]);
    return result.affectedRows; // 返回受影响的行数
  },

  // 更新日志
  async update(logId, logData) {
    const fields = [];
    const values = [];

    // 动态生成更新字段
    Object.keys(logData).forEach((key) => {
      if (logData[key] !== undefined && logData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(logData[key]);
      }
    });

    // 确保有数据更新
    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    // 拼接更新 SQL
    const query = `UPDATE jf_command_logs SET ${fields.join(', ')} WHERE id = ?`;
    values.push(logId); // 将 logId 放到参数的最后

    const [result] = await db.query(query, values);
    return result.affectedRows; // 返回受影响的行数
  },
};
