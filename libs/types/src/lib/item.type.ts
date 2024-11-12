import { WarehouseThreshold } from './warehouse-threshold.type';

export type Item = {
    name: string;
    quantity: number;
    unit_price: number;
    warehouseThreshold: WarehouseThreshold;
};
