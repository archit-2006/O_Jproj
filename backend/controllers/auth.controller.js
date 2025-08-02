const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    const existingUser = await User.findOne({ email });
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
