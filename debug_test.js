try {
    const tokenService = require('./backend/src/services/token.service');
    const jwt = require('jsonwebtoken');
    console.log("Modules loaded successfully");
    console.log("TokenService keys:", Object.keys(tokenService));
} catch (e) {
    console.error("Module load failed:", e);
}
