"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInsight = void 0;
const insight_service_1 = require("../services/insight.service");
const createInsight = async (req, res) => {
    try {
        const { summary } = req.body;
        if (!summary) {
            return res.status(400).json({ error: 'Resumo (summary) é obrigatório' });
        }
        const insight = await (0, insight_service_1.generateInsight)(summary);
        return res.status(200).json({ insight });
    }
    catch (error) {
        console.error('Erro ao gerar insight:', error);
        return res.status(500).json({ error: 'Erro interno ao gerar insight' });
    }
};
exports.createInsight = createInsight;
