const crypto = require('crypto-js')

module.exports = {    
    encrypt(senha) {
        const hash = crypto.SHA256(senha)
        return String(hash);
    }
}