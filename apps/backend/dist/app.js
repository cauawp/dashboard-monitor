"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ping_routes_1 = __importDefault(require("./routes/ping.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const insight_routes_1 = __importDefault(require("./routes/insight.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/ping', ping_routes_1.default);
app.use('/api/events', event_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/insight', insight_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
