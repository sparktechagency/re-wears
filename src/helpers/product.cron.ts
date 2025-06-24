import cron from 'node-cron';
import { Product } from '../app/modules/product/product.model';

export const scheduleProductStatusCron = () => {
    cron.schedule('* * * * *', async () => {
      const products = await Product.find({ status: 'Reserved' });
      const currentTime = new Date().getTime();
      for (const product of products) {
        const timeDifference = currentTime - product.updatedAt!.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        if (hoursDifference > 24) {
          product.status = 'Active';
          await product.save();
        }
      }
    });
}
