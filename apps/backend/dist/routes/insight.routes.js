"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insight_controller_1 = require("../controllers/insight.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.verifyToken, insight_controller_1.createInsight);
exports.default = router;
