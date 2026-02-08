import { Request, Response, NextFunction, Router } from 'express';
import { login, me, register } from '../controllers/authController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
}

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, me);

export default router;
