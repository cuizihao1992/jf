const express = require('express');
const bodyParser = require('body-parser');

// 导入各模块
const deviceLogs = require('./modules/deviceLogs');
const deviceTasks = require('./modules/deviceTasks.js');
const deviceTypes = require('./modules/deviceTypes');
const devices = require('./modules/devices');
const regions = require('./modules/regions');
const scheduledTasks = require('./modules/scheduledTasks');
const deviceReviews = require('./modules/deviceReviews.js');
const deviceStatusHistory = require('./modules/deviceStatusHistory');

// 通用路由生成器
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

const app = express();
const PORT = 3000;

// 中间件
app.use(bodyParser.json());

// 使用生成的路由
app.use('/logs', createRouter(deviceLogs));
app.use('/tasks', createRouter(deviceTasks));
app.use('/device-types', createRouter(deviceTypes));
app.use('/devices', createRouter(devices));
app.use('/regions', createRouter(regions));
app.use('/scheduled-tasks', createRouter(scheduledTasks));
app.use('/reviews', createRouter(deviceReviews));
app.use('/status-history', createRouter(deviceStatusHistory));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
