const express = require('express');

// 创建路由中间件
function createRouter(module) {
  const router = express.Router();

  router.use(express.json()); // 解析 JSON 请求体
  router.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

  // 查询（支持动态查询条件）
  if (module.getTree) {
    router.get('/tree', async (req, res, next) => {
      try {
        const result = await module.getTree(req.query); // 查询参数已通过中间件转换
        res.json(result);
      } catch (error) {
        next(error);
      }
    });
  }
  router.get('/', async (req, res, next) => {
    try {
      const result = await module.query(req.query); // 查询参数已通过中间件转换
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // 根据 ID 查询单条记录
  router.get('/:id', async (req, res, next) => {
    try {
      const result = await module.query({ id: req.params.id });
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      next(error);
    }
  });

  // 新增记录
  router.post('/', async (req, res, next) => {
    try {
      const insertId = await module.add(req.body); // 请求体已通过中间件转换
      res.status(201).json({ insertId });
    } catch (error) {
      next(error);
    }
  });

  // 更新记录
  router.put('/:id', async (req, res, next) => {
    try {
      const affectedRows = await module.update(req.params.id, req.body); // 请求体已通过中间件转换
      if (affectedRows > 0) {
        res.json({ message: 'Record updated successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      next(error);
    }
  });

  // 删除记录
  router.delete('/:id', async (req, res, next) => {
    try {
      const affectedRows = await module.delete(req.params.id);
      if (affectedRows > 0) {
        res.json({ message: 'Record deleted successfully' });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    } catch (error) {
      next(error);
    }
  });

  // 错误处理中间件
  router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: error.message });
  });

  return router;
}

module.exports = createRouter;
