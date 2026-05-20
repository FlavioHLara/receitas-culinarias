import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { pool } from './config/db'

const PORT = process.env.PORT || 3333

async function main() {
    await pool.getConnection()
    console.log('Banco de dados conectado')

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
    })
}

main().catch((err) => {
    console.error('Erro ao iniciar servidor:', err)
    process.exit(1)
})