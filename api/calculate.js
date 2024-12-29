export default function handler(req, res) {
    if (req.method === 'POST') {
        // Lógica de processamento
        res.status(200).json({ message: 'Sucesso' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
