const db = require('./mysql.js');

module.exports = {
  // 查询设备审核记录
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_device_reviews';
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

  // 新增审核记录
  async add(reviewData) {
    const { device_id, review_status, reviewer, review_time, review_comments } =
      reviewData;

    const query = `
      INSERT INTO jf_device_reviews 
      (device_id, review_status, reviewer, review_time, review_comments) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      device_id,
      review_status,
      reviewer,
      review_time,
      review_comments,
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
