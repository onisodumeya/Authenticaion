const express = require('express');
const app = express();
const port = 3001

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/login', (req, res) =>{
    res.status(200).json("You have sucessfully logged in")

})

app.get("/register", (req, res) => {
    res.status(200).json("You have sucessfully registered");
});




app.listen(port, () =>{
    console.log(`Listening on port ${port}`);
    
})