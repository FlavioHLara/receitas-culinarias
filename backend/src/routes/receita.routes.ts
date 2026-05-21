import { Router } from 'express';
import * as receitaController from '../controllers/receita.controller';

const router = Router();

router.get('/', receitaController.listarRceitas);
router.get('/:id', receitaController.buscarReceitaPorId);
router.post('/', receitaController.criaReceita);
router.put('/:id', receitaController.atualizarReceita);
router.delete('/:id', receitaController.deletarReceita);

export default router;
