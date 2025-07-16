import cron from 'node-cron';
import { Product } from '../app/modules/product/product.model';
import { logger } from '../shared/logger';

export const scheduleProductStatusCron = () => {
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        const products = await Product.find({ status: 'Reserved' });
        const currentTime = Date.now();
        for (const product of products) {
          if (!product.updatedAt) continue;
          const timeDifference = currentTime - product.updatedAt.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);
          if (hoursDifference > 24) {
            product.status = 'Active';
            await product.save();
          }
        }
      } catch (error) {
        logger.error('Error in Product status change Cron Job:', error);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Dhaka',
    }
  );
  logger.info('✅ Product status change Cron Job started and running every minute.');
}