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
    console.log("Öğrenciler:");
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
        console.log("Öğrenci Güncellendi:");
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
        console.log("Öğrenci Silindi:");
        console.log(result.rows);
    }


}

async function getStudentById(id){
    const result = await pool.query(
        "SELECT * FROM students WHERE id = $1",
        [id]
    );
     if(result.rows.length === 0){
        console.log("Bu ID'ye ait öğrenci bulunamadı.");
    }
    else{
        console.table(result.rows);
    }


}


async function main() {

    while(true){
        try{
            
        
        console.log("\n--- Öğrenci Yönetim Sistemi ---");
        console.log("1 - Öğrenci Ekle");
        console.log("2 - Öğrencileri Listele");
        console.log("3 - Öğrenci Güncelle");
        console.log("4 - Öğrenci Sil");
        console.log("5 - Öğrenci Ara");
        console.log("6 - Çıkış");

        const choice = await askQuestion("Seçiminiz: ");
        
        if(choice === "1"){
            const name = await askQuestion("Ad: ");

            if(name.trim() === ""){
                console.log("İsim Boş Bırakılamaz.");
                continue;
            }


            const age = Number(
                await askQuestion("Yaşı: ")
            );
            if(isNaN(age) || age <= 0 ){
                console.log("Geçerli Bir Yaş Girin.");
                continue;
            }


            const email = await askQuestion("Email: ");
            if(!email.includes("@")){
                console.log("Geçerli Bir Email Girin.");
                continue;
            }

            await addStudent(name,age,email);
        }

        else if(choice === "2"){
            await getStudents();
        }

        else if(choice === "3"){
            const id = Number(
                await askQuestion("Güncellenecek Öğrencinin ID'si: ")
            );

            if(isNaN(id) || id<= 0){
                console.log("Geçerli Bir ID girin.");
                continue;
            }

            
            const age = Number(
                await askQuestion("Yeni yaş: ")
            );

            if(isNaN(age) || age <=0 ){
                console.log("Geçerli Bir Yaş Girin.");
                continue;
            }


            await updateStudent(id,age);
        }

        else if(choice === "4"){
            const id = Number(
                await askQuestion("Silinecek Öğrencinin ID'si: ")
            );

            if(isNaN(id) || id <= 0){
                console.log("Geçerli Bir ID Girin.");
                continue;
            }
            await deleteStudent(id);
        }
        else if(choice === "5"){
            const id = Number(
                await askQuestion("Aranacak öğrencinin ID'si: ")
            );

            if(isNaN(id) || id <= 0){
                console.log("Geçerli bir ID girin.");
                continue;
            }

            await getStudentById(id);

        }

        else if (choice === "6"){
            console.log("Programdan çıkılıyor...");
            break;

        } else {
            console.log("Geçersiz İşlem");
        }
    }


        catch(error){
            if(error.code === "23505"){
                console.log("Bu Email Zatan Kayıtlı");
            } else {
                console.error("Hata: ", error.message);
            }

        }                
    }
    r1.close();
    await pool.end();

}

main();
