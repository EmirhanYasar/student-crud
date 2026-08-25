const pool = require("./db");

async function testConnection() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Veritabanı bağlantısı başarılı!");
        console.log(result.rows[0]);
    } catch (error) {
        console.error("Veritabanı bağlantı hatası:", error.message);
    } finally {
        await pool.end();
    }
}

testConnection();