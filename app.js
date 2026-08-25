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

    console.log(result.rows);

}

async function updateStudent(id,age){
    const result = await pool.query(
        "UPDATE students SET age = $1 WHERE id = $2 RETURNING* ",
    [age,id]
    );

    console.log(result.rows);
}

async function deleteStudent(id){
    const result = await pool.query(
        "DELETE FROM students WHERE id = $1 RETURNING * ",
        [id]
    );

    console.log(result.rows);
}
