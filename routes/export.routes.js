import { Router } from 'express';
import { getExportData,getAverageData } from '../controllers/export.controller.js';

const router = Router();

router.get("/getExportData", getExportData);
router.get("/getAverageData", getAverageData);
export default router;