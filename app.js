const pool = require("./db");
const readline = require("readline");




const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});

function askQuestion(question){
    return new Promise((resolve)=> {
        r1.question(question,(answer ) =>{
            resolve(answer);
        })
    })
}



async function getStudents(){
    const result = await pool.query(
        "SELECT * FROM students"
    );
    console.log("Öğrenci Eklendi:");
    console.table(result.rows)

}

async function addStudent(name,age,email){
    const result = await pool.query(
        "INSERT INTO students ( name,age,email) VALUES ($1,$2,$3) RETURNING* ",
        [name,age,email]
    );

    console.log(result.rows);

}

async function updateStudent(id,age){
    const result = await pool.query(
        "UPDATE students SET age = $1 WHERE id = $2 RETURNING* ",
    [age,id]
    );

    if(result.rows.length === 0){
        console.log("Bu ID'ye Ait Öğrenci Bulunamadı. ");
    }
    else{
        console.log8("Öğrenci Güncellendi:");
        console.log(result.rows);
    }

}

async function deleteStudent(id){
    const result = await pool.query(
        "DELETE FROM students WHERE id = $1 RETURNING * ",
        [id]
    );

    if(result.rows.length === 0){
        console.log("Bu ID'ye Ait Öğrenci Bulunamadı.")
    }
    else{
        console.log("Öğrenci Güncellendi");
        console.log(result.rows);
    }


}


async function main() {

    try{
        while(true){
            
        
        console.log("\n--- Öğrenci Yönetim Sistemi ---");
        console.log("1 - Öğrenci Ekle");
        console.log("2 - Öğrencileri Listele");
        console.log("3 - Öğrenci Güncelle");
        console.log("4 - Öğrenci Sil");
        console.log("5 - Çıkış");

        const choice = await askQuestion("Seçiminiz: ");
        
        if(choice === "1"){
            const name = await askQuestion("Ad: ");
            const age = Number(await askQuestion("Yaşı: "));
            const email = await askQuestion("Email: ");

            await addStudent(name,age,email);
        }

        else if(choice === "2"){
            await getStudents();
        }

        else if(choice === "3"){
            const id = Number(await askQuestion("Güncellenecek Öğrencinin ID'si: "));
            const age = Number(await askQuestion("Yeni yaş: "));

            await updateStudent(id,age);
        }

        else if(choice === "4"){
            const id = Number(await askQuestion("Silinecek Öğrencinin ID'si: "));
            await deleteStudent(id);
        }

        else if (choice === "5"){
            console.log("Programdan çıkılıyor...");
            break;

        } else {
            console.log("Geçersiz İşlem");
        }
    }


    } catch(error){
        console.error("Hata: ", error.message);

    } finally{
        r1.close();
        await pool.end();
    }
}

main();
