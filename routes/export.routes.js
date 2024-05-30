import express, { Router } from 'express';
import { getExportData } from '../controllers/export.controller.js';

const router = Router();

router.get("/", getExportData);

export default router;