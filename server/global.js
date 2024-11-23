const express = require('express');
const clients = new Map();
const statusList = {};

// 工具函数：将对象的键从 camelCase 转换为 snake_case
function toSnakeCase(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // 驼峰转下划线
    result[snakeKey] = obj[key];
  });
  return result;
}

function createRouter(module) {
  const router = express.Router();

  // 查询（支持动态查询条件）
  router.get('/', async (req, res) => {
    try {
      const filter = toSnakeCase(req.query); // 转换查询参数
      const result = await module.query(filter);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 根据 ID 查询单条记录
  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await module.query({ id });
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 新增记录
  router.post('/', async (req, res) => {
    try {
      const data = toSnakeCase(req.body); // 转换请求体
      const insertId = await module.add(data);
      res.status(201).json({ insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 更新记录
  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const data = toSnakeCase(req.body); // 转换请求体
      const affectedRows = await module.update(id, data);
      if (affectedRows > 0) {
        res.json({ message: 'Record updated successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 删除记录
  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await module.delete(id);
      if (affectedRows > 0) {
        res.json({ message: 'Record deleted successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = { clients, statusList, createRouter };
