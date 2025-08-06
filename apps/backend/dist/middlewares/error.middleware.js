"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error(err.stack || err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno no servidor',
    });
};
exports.errorHandler = errorHandler;
