const db = require('./mysql.js');

module.exports = {
  // 查询用户信息
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_user';
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

  // 新增用户
  async add(userData) {
    const {
      username,
      password,
      nick_name,
      avatar,
      email,
      phone,
      country,
      region,
      user_type,
      registration_date,
      last_login,
      login_ip,
      created_time,
      status,
      role,
      permissions,
      data_permissions,
      application_type,
      token,
    } = userData;

    const query = `
      INSERT INTO jf_user 
      (
        username, password, nick_name, avatar, email, phone, country, 
        region, user_type, registration_date, last_login, login_ip, 
        created_time, status, role, permissions, data_permissions, 
        application_type, token
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      username,
      password,
      nick_name,
      avatar,
      email,
      phone,
      country,
      region,
      user_type,
      registration_date,
      last_login,
      login_ip,
      created_time,
      status,
      role,
      permissions,
      data_permissions,
      application_type,
      token,
    ]);

    return result.insertId;
  },

  // 删除用户
  async delete(userId) {
    const query = 'DELETE FROM jf_user WHERE user_id = ?';
    const [result] = await db.query(query, [userId]);
    return result.affectedRows;
  },

  // 更新用户信息
  async update(userId, userData) {
    const fields = [];
    const values = [];

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_user SET ${fields.join(', ')} WHERE user_id = ?`;
    values.push(userId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
