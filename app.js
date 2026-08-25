const pool = require("./db");

async function getStudents(){
    const result = await pool.query(
        "SELECT * FROM students"
    );
    console.log(result.rows)

}

async function addStudent(name,age,email){
    const result = await pool.query(
        "INSERT INTO students ( name,age,email) VALUES ($1,$2,$3) RETURNING",
        [name,age,email]
    );

}





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