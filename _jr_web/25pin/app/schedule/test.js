/**
 * 测试代码
 *
 * @link http://eggjs.org/zh-cn/basics/schedule.html
 */

'use strict';

/**
* @property {Object} schedule
*  - {String} type - schedule type, `worker` or `all`, worker 类型的定时任务在到执行时间时只会有一个进程执行
*  - {String} [cron] - cron expression, [see below](#cron-style-scheduling)
*  - {String | Number} [interval] - interval expression in millisecond or express explicitly like '1h'. [see below](#interval-style-scheduling)
*  - {Boolean} [immediate] - To run a scheduler at startup
*  - {Boolean} [disable] - whether to disable a scheduler, usually use in dynamic schedule
*/

/**
 * cron
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬    ┬
  │    │    │    │    │    |
  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  │    │    │    │    └───── month (1 - 12)
  │    │    │    └────────── day of month (1 - 31)
  │    │    └─────────────── hour (0 - 23)
  │    └──────────────────── minute (0 - 59)
  └───────────────────────── second (0 - 59, optional)
 */

module.exports = app => { // eslint-disable-line no-unused-vars
  return {
    schedule: {
      type: 'worker',
      // interval: 3600000 * 24, // 每天
      cron: '0 0 4 * * *',
      immediate: true,
      disable: true,
    },

    async task(ctx) {
      // await ctx.service.goosetalk.run(17822, 18500);
      await ctx.service.babytree.run(26132, 26300);
    },
  };
};
