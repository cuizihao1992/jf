const db = require('./mysql.js');
const user = require('./user.js');
module.exports = {
  // 查询用户审核记录
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_user_review';
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
    if (result.affectedRows === 0) {
      throw new Error('No user review found with the given ID');
    }

    // 如果审核状态为 "通过"，则创建用户
    if (reviewData.review_status === 'approved') {
      // 获取需要创建用户的信息，假设可以从 `reviewData` 中获取
      const userData = {
        username: reviewData.username,
        password: reviewData.password, // 假设密码已经存在于 reviewData 中
        nick_name: reviewData.nick_name || '', // 可能需要默认值
        avatar: reviewData.avatar || '',
        email: reviewData.email || '',
        phone: reviewData.phone,
        country: reviewData.country,
        region: reviewData.region,
        user_type: reviewData.user_type,
        registration_date: new Date(), // 设置为当前时间
        last_login: null, // 初次创建，没有登录信息
        login_ip: null,
        created_time: new Date(), // 设置为当前时间
        status: 'active', // 初始状态设置为激活
        role: reviewData.role || 'user', // 设置默认角色为用户
        permissions: reviewData.permissions || '',
        data_permissions: reviewData.data_permissions || '',
        application_type: reviewData.application_type,
        token: null, // 初始 token 为空
      };

      try {
        const newUserId = await user.add(userData);
        console.log(`New user created with ID: ${newUserId}`);
      } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user');
      }
    }

    return result.affectedRows;
  },
};
