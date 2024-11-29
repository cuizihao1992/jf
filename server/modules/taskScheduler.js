const deviceTasks = require('./deviceTasks'); // 引用 deviceTasks 模块
const moment = require('moment');

// 启动时通知主进程
process.send('TaskScheduler started.');

/**
 * 定时检查任务并执行到期任务
 */
async function checkAndExecuteTasks() {
  try {
    // 查询待处理任务
    const pendingTasks = await deviceTasks.query({ task_status: 'pending' });
    const now = moment();

    for (const task of pendingTasks) {
      const startTime = moment(task.start_time);

      // 如果任务到期，执行逻辑
      if (startTime.isBefore(now)) {
        console.log(`Executing Task ID: ${task.task_id}`);

        // 更新任务状态为 in_progress
        await deviceTasks.update(task.device_task_id, {
          task_status: 'in_progress',
          send_time: now.format('YYYY-MM-DD HH:mm:ss'),
        });

        // 模拟任务完成
        setTimeout(async () => {
          await deviceTasks.update(task.device_task_id, {
            task_status: 'completed',
            completion_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          });
          process.send(`Task ID ${task.task_id} completed`);
        }, 1000); // 模拟 1 秒任务完成
      }
    }
  } catch (err) {
    console.error('[TaskScheduler] Error:', err.message);
    process.send(`[TaskScheduler] Error: ${err.message}`);
  }
}

// 每分钟执行一次检查
setInterval(checkAndExecuteTasks, 60 * 1000);
