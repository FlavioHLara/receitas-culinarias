import { Router } from 'express';
import * as receitaController from '../controllers/receita.controller';
import { autenticar } from '../middlewares/autenticar';

const router = Router();

router.use(autenticar);

router.get('/', receitaController.listarReceitas);
router.get('/:id', receitaController.buscarReceitaPorId);
router.post('/', receitaController.criaReceita);
router.put('/:id', receitaController.atualizarReceita);
router.delete('/:id', receitaController.deletarReceita);

export default router;
