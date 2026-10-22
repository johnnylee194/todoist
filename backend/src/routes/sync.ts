import { Router, Request, Response, NextFunction } from 'express';
import { syncService } from '../services/sync.service';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

router.post('/pull', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const clientLastSync = req.body.client_last_sync || 0;

    const data = syncService.pull(userId, clientLastSync);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/push', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const payload = req.body;

    syncService.push(userId, payload);
    res.json({ status: 'ok', server_timestamp: Date.now() });
  } catch (error) {
    next(error);
  }
});

export default router;
