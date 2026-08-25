const pool = require("./db");

async function testConnection() {
    try {
        const result = await pool.query(" DELETE FROM students WHERE id = $1 RETURNING *",
            [9]
        );
        console.log(result.rows);
        
    } catch (error) {
        console.error("Veritabanı bağlantı hatası:", error.message);
    } finally {
        await pool.end();
    }
}

testConnection();