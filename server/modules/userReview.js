const db = require('./mysql.js');

module.exports = {
  // 查询用户审核记录
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_user_review';
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

  // 新增用户审核记录
  async add(reviewData) {
    const {
      username,
      password,
      phone,
      application_date,
      country,
      region,
      user_type,
      application_type,
      review_status,
      reviewer,
      review_time,
      review_opinion,
      remarks,
      registration_time,
      user_status,
      user_permissions,
      data_permissions,
    } = reviewData;

    const query = `
      INSERT INTO jf_user_review 
      (
        username, password, phone, application_date, country, region, 
        user_type, application_type, review_status, reviewer, review_time, 
        review_opinion, remarks, registration_time, user_status, 
        user_permissions, data_permissions
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      username,
      password,
      phone,
      application_date,
      country,
      region,
      user_type,
      application_type,
      review_status,
      reviewer,
      review_time,
      review_opinion,
      remarks,
      registration_time,
      user_status,
      user_permissions,
      data_permissions,
    ]);

    return result.insertId;
  },

  // 删除用户审核记录
  async delete(reviewId) {
    const query = 'DELETE FROM jf_user_review WHERE id = ?';
    const [result] = await db.query(query, [reviewId]);
    return result.affectedRows;
  },

  // 更新用户审核记录
  async update(reviewId, reviewData) {
    const fields = [];
    const values = [];

    Object.keys(reviewData).forEach((key) => {
      if (reviewData[key] !== undefined && reviewData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(reviewData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_user_review SET ${fields.join(', ')} WHERE id = ?`;
    values.push(reviewId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
