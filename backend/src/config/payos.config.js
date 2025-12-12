const { PayOS } = require('@payos/node');

// Initialize PayOS with credentials from environment variables
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

module.exports = payOS;
