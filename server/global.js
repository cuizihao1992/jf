const express = require('express');
const clients = new Map();
const statusList = {};
function createRouter(module) {
  const router = express.Router();

  // 查询（支持动态查询条件）
  router.get('/', async (req, res) => {
    try {
      const result = await module.query(req.query);
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
      const insertId = await module.add(req.body);
      res.status(201).json({ insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 更新记录
  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const affectedRows = await module.update(id, req.body);
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
