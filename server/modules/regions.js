const db = require('./mysql.js');

module.exports = {
  async query(filter) {
    const baseQuery = 'SELECT * FROM jf_regions';
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

  async add(regionData) {
    const { region_name, parent_region_id, description } = regionData;

    const query = `
      INSERT INTO jf_regions (region_name, parent_region_id, description) 
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(query, [
      region_name,
      parent_region_id,
      description,
    ]);
    return result.insertId;
  },

  async delete(regionId) {
    const query = 'DELETE FROM jf_regions WHERE region_id = ?';
    const [result] = await db.query(query, [regionId]);
    return result.affectedRows;
  },

  async update(regionId, regionData) {
    const fields = [];
    const values = [];

    Object.keys(regionData).forEach((key) => {
      if (regionData[key] !== undefined && regionData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(regionData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No data provided for update');
    }

    const query = `UPDATE jf_regions SET ${fields.join(', ')} WHERE region_id = ?`;
    values.push(regionId);

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },
};
