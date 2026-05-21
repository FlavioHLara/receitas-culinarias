import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/cria-usuario', authController.criaUsuario);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
