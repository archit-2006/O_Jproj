const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require('../utils/errorHandler');
exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the information");
    }

// console.log("Email received:", email);

    const existingUser = await User.findOne({ email });

// console.log("Existing user found:", existingUser);
    if (existingUser) {
      return res.status(400).send("User already exists with same email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    user.token = token;
    user.password = undefined;

    res.status(200).json({ message: "You have successfully registered!", user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.validateUser = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    // if (!(email && password)) {
    //   return next(errorHandler(401,"Please enter all the information"));
    // }

    const validUser = await User.findOne({ email });

    if (!validUser) {
        return next(errorHandler(404,"Email not found"));
      }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    
    if (!validPassword) {
        return next(errorHandler(401,"Invalid Cridentials !"));
      }
    

    const token = jwt.sign(
      { id: validUser._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    validUser.token = token;
    validUser.password = undefined;
    
    res.status(200).json({ message: "You have successfully logged in!", validUser });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};