const db = require('./mysql.js');

module.exports = {
  // 查询设备审核记录
  async query(filter) {
    const baseQuery = `
      SELECT 
        reviews.*, 
        devices.*
      FROM jf_device_reviews AS reviews
      LEFT JOIN jf_devices AS devices ON reviews.device_id = devices.id
    `;
    const conditions = [];
    const values = [];

    // 根据过滤条件动态生成 WHERE 子句
    Object.keys(filter).forEach((key) => {
      if (filter[key] !== undefined && filter[key] !== null) {
        conditions.push(`reviews.${key} = ?`);
        values.push(filter[key]);
      }
    });

    // 如果有过滤条件，则添加 WHERE 子句
    const query = conditions.length
      ? `${baseQuery} WHERE ${conditions.join(' AND ')}`
      : baseQuery;

    // 执行查询
    const [rows] = await db.query(query, values);
    return rows;
  },

  // 新增审核记录
  async add(reviewData) {
    const {
      device_id,
      review_status,
      reviewer,
      review_time,
      review_comments,
      review_type,
      user_id,
    } = reviewData;

    const query = `
      INSERT INTO jf_device_reviews 
      (device_id, review_status, reviewer, review_time, review_comments, review_type, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      device_id,
      review_status,
      reviewer,
      review_time,
      review_comments,
      review_type,
      user_id,
    ]);

    return result.insertId;
  },

  // 删除审核记录
  async delete(reviewId) {
    const query = 'DELETE FROM jf_device_reviews WHERE review_id = ?';
    const [result] = await db.query(query, [reviewId]);
    return result.affectedRows;
  },

  // 更新审核记录
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

    const query = `UPDATE jf_device_reviews SET ${fields.join(', ')} WHERE review_id = ?`;
    values.push(reviewId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
