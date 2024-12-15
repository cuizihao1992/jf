const db = require('./mysql.js');
const userQuery = require('./user.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_devices';
    const conditions = [];
    const values = [];
    // 添加审核状态过滤条件
    conditions.push('review_status = ?');
    values.push('approved');

    // 提取用户信息
    const userInfo = filter.userInfo;
    delete filter.userInfo; // 移除用户信息，避免误用

    let permittedIds = [];
    // 动态添加用户权限过滤条件
    if (userInfo && userInfo.userId) {
      const userData = await userQuery.query({
        user_id: userInfo.userId,
      });
      if (userData.length > 0) {
        // 假设权限存储为字符串，如 "1,2,3"
        const permissions = userData[0].data_permissions;
        if (permissions === 'ALL') {
          // ALL 表示不限制权限
          permittedIds = null;
        } else {
          // 解析具体权限 ID
          permittedIds = permissions.split(',').map(Number);
        }
      }
    }

    // 如果有具体权限限制，添加到查询条件
    if (permittedIds && permittedIds.length > 0) {
      conditions.push(`id IN (${permittedIds.map(() => '?').join(', ')})`);
      values.push(...permittedIds);
    }
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

  async add(deviceData) {
    const {
      device_name,
      device_type,
      region,
      ytsbh,
      gkmkh,
      cpj,
      lat,
      lon,
      connection_status,
      power_status,
      device_status,
      current_azimuth,
      current_elevation,
      power_voltage,
      power_level,
      install_time,
      last_sync_time,
      synced_device_time,
      user_id,
    } = deviceData;

    // 插入设备记录
    const deviceQuery = `
      INSERT INTO jf_devices 
      (device_name, device_type, region, ytsbh, gkmkh, cpj, lat, lon, connection_status, power_status, device_status, current_azimuth, current_elevation, power_voltage, power_level, install_time, last_sync_time, synced_device_time, user_id, review_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [deviceResult] = await db.query(deviceQuery, [
      device_name,
      device_type,
      region,
      ytsbh,
      gkmkh,
      cpj,
      lat,
      lon,
      connection_status,
      power_status,
      device_status,
      current_azimuth,
      current_elevation,
      power_voltage,
      power_level,
      install_time,
      last_sync_time,
      synced_device_time,
      user_id,
    ]);

    const deviceId = deviceResult.insertId;

    // 插入审核记录
    const reviewQuery = `
      INSERT INTO jf_device_reviews 
      (device_id, review_status, review_type, user_id) 
      VALUES (?, 'pending', 'add_device', ?)
    `;

    await db.query(reviewQuery, [deviceId, user_id]);

    return deviceId;
  },

  async delete(deviceId) {
    const query = 'DELETE FROM jf_devices WHERE id = ?';
    const [result] = await db.query(query, [deviceId]);
    return result.affectedRows;
  },

  async update(deviceId, deviceData) {
    const fields = [];
    const values = [];

    Object.keys(deviceData).forEach((key) => {
      if (deviceData[key] !== undefined && deviceData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(deviceData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_devices SET ${fields.join(', ')} WHERE id = ?`;
    values.push(deviceId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
  async getTree(filter) {
    try {
      const baseQuery = 'SELECT * FROM jf_devices';
      const conditions = [];
      const values = [];
      conditions.push('review_status = ?');
      values.push('approved');
      // 提取用户信息
      const userInfo = filter.userInfo;
      delete filter.userInfo; // 移除用户信息，避免误用

      let permittedIds = [];
      // 动态添加用户权限过滤条件
      if (userInfo && userInfo.userId) {
        const userData = await userQuery.query({
          user_id: userInfo.userId,
        });
        if (userData.length > 0) {
          // 假设权限存储为字符串，如 "1,2,3"
          const permissions = userData[0].data_permissions;
          if (permissions === 'ALL') {
            // ALL 表示不限制权限
            permittedIds = null;
          } else {
            // 解析具体权限 ID
            permittedIds = permissions.split(',').map(Number);
          }
        }
      }

      // 如果有具体权限限制，添加到查询条件
      if (permittedIds && permittedIds.length > 0) {
        conditions.push(`id IN (${permittedIds.map(() => '?').join(', ')})`);
        values.push(...permittedIds);
      }

      const query = conditions.length
        ? `${baseQuery} WHERE ${conditions.join(' AND ')}`
        : baseQuery;

      const [rows] = await db.query(query, values);

      // 构造树形结构
      const tree = rows.reduce((acc, row) => {
        // 按 region 分组
        let regionNode = acc.find((node) => node.label === row.region);
        if (!regionNode) {
          regionNode = { label: row.region, children: [] };
          acc.push(regionNode);
        }

        // 按 device_type 分组
        let typeNode = regionNode.children.find(
          (node) => node.label === row.device_type
        );
        if (!typeNode) {
          typeNode = { label: row.device_type, children: [] };
          regionNode.children.push(typeNode);
        }

        // 按 connection_status 分组
        let statusNode = typeNode.children.find(
          (node) => node.label === row.connection_status
        );
        if (!statusNode) {
          statusNode = { label: row.connection_status, children: [] };
          typeNode.children.push(statusNode);
        }

        // 添加设备名称
        statusNode.children.push({ label: row.device_name });

        return acc;
      }, []);

      return tree;
    } catch (error) {
      console.error('获取树状结构失败:', error);
      throw new Error('无法获取设备数据树状结构');
    }
  },
};
