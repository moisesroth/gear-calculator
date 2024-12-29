const express = require('express');
const app = express();
const path = require('path');

// Middleware para tratar o corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/calculate', (req, res) => {
    console.log('Dados recebidos:', req.body); // Log para depuração
    const { rpm, relations, differential, rollingRadius } = req.body;

    // Validação dos campos
    if (!rpm || !relations || !differential || !rollingRadius) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Conversão dos valores para float
        const rpmValue = parseFloat(rpm);
        const differentialValue = parseFloat(differential);
        const radius = parseFloat(rollingRadius) / 1000; // Converter mm para metros
        const relationsArray = relations.split(',').map(Number);

        // Cálculo dos resultados
        const results = relationsArray.map((relation, index) => {
            const velocity = (2 * Math.PI * radius * rpmValue) / (relation * differentialValue * 60) * 3.6; // Fórmula corrigida
            const nextRpm = index > 0 ? rpmValue * (relation / relationsArray[index - 1]) : null;

            return {
                gear: index + 1,
                velocity: Math.round(velocity), // Velocidade arredondada
                relation: relation.toFixed(2),  // Relação com 2 casas decimais
                rpmAfterShift: nextRpm ? Math.round(nextRpm) : null // RPM arredondado
            };
        });

        res.json({ results });
    } catch (error) {
        console.error('Erro no cálculo:', error.message);
        res.status(500).json({ error: 'Erro ao processar os dados.' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
