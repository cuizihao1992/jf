const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_devices';
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

    const query = `
      INSERT INTO jf_devices 
      (device_name, device_type, region, ytsbh, gkmkh, cpj, lat, lon, connection_status, power_status, device_status, current_azimuth, current_elevation, power_voltage, power_level, install_time, last_sync_time, synced_device_time, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
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

    return result.insertId;
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
};
