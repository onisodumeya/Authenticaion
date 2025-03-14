import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {object, string, number, ValidationError} from 'yup';
const app = express();
const port = 3001;
const saltRound = 10;
import { db } from './config/db.js'



const userSchema = object({
    name: string().required().min(3, 'Name charater must 3 letters and above').max(45, 'Exceeded maximum charact limit'),
    email: string().email().required(),
    age: number().integer().positive().required()
})


const userValidation = async (req, res, next)=> {
        try{
            await userSchema.validate(req.body, {abortEarly: false})
            next();

        }catch(error){
            if(error instanceof ValidationError){
                res.json(error.errors)
            }else{
                res.json("Something went wrong")
            }

            
        }
    

       

       
    }





app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/login', async (req, res) =>{

    const {email, password} = req.body;

     const result =  await db.query("SELECT * FROM users WHERE email = $1", [email])

     const user = result.rows
      
     if(user.length === 0){
        res.status(400).json("User does not exist")
     }

     bcrypt.compare(password, user[0].password, (err, result)=>{
        if(err){
            console.log(err);
            
        }else{
            res.status(200).json({message:"You have sucessfully logged in", user: user}) 
        }
        
     })

    //  if(password === user[0].password){
    //     res.status(200).json({message:"You have sucessfully logged in", user: user})
    //  }else{
    //     res.json("Incorrect password")
    //  }

       
   
    

})

app.post("/register", userValidation, async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;

     await bcrypt.hash(password, saltRound, async (err, hash) => {

        const result = await db.query("INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *", 
            [name, email, hash, age])
    
        res.status(200).json({message: "Successfully Registered", users: result.rows[0]});

     } )

    
    

   
});







app.listen(port, () =>{
    console.log(`Listening on port ${port}`);
    
})
