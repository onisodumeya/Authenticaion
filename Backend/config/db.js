import pg from 'pg'


export const db = new pg.Client({
    user: "postgres",
    database: "authentication",
    host: "localhost",
    password: "password",
    port: 5432
});


db.connect().then(()=>{
    console.log("Database is connected");
    
}).catch((error)=>{
    console.log("Database error", error);
    
})


