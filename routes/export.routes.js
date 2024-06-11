import express, { Router } from 'express';
import { getExportData,getAverageData, getAverageDataAll } from '../controllers/export.controller.js';

const router = Router();

router.get("/getExportData", getExportData);
router.get("/getAverageData", getAverageData);
router.get("/getAverageDataAll", getAverageDataAll);

export default router;