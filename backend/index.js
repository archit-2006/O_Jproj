const express = require("express");
const app = express()
const {DBConnection} = require("./database/db");
DBConnection();
const User= require("./models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.post("/register", async (req, res) => {
  try{
    const{ firstname,lastname,email,password }=req.body;

    if(!(firstname && lastname && email && password)){
      return res.status(400).send("Please enter all the information");
    }

    const existingUser= await User.findOne({email});
    if(existingUser){
      return res.status(400).send("User already exist with same email");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user=await User.create({
      firstname,
      lastname,
      email,
      password : hashedPassword,
    });

    const token = jwt.sign({id : user._id,email},process.env.SECRET_KEY,{
    expiresIn: '1h',
    });
    user.token = token;
    user.password = undefined;
    res.status(200).json({message: 'You have successfully registered!',user})

  }
  catch(error){
    console.log(error);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});