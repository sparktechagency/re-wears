import { Response } from 'express';

type IData<T> = {
    success: boolean;
    statusCode: number;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        totalPage: number;
        total: number;
    };
    data?: T;
    meta?: Record<string, any>;
};

const sendResponse = <T>(res: Response, data: IData<T>) => {
    const resData: any = {
        success: data.success,
        message: data.message,
        pagination: data.pagination,
        data: data.data,
    };

    if (data.meta) {
        resData.meta = data.meta;
    }

    res.status(data.statusCode).json(resData);
};

export default sendResponse;
