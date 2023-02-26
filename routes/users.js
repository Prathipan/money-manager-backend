const router = require("express").Router();
const User = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cPassword: req.body.cPassword,
  });

  const existedUser = await User.findOne({email : newUser.email});
  if(existedUser){
    res.status(403).json("User Already exists");
  }else  if (newUser.password == newUser.cPassword) {
    newUser.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_KEY
    ).toString();
    newUser.cPassword = newUser.password;
    try {
      const savedUser = await newUser.save();
      const {password,cPassword,...others} = savedUser._doc;
      res.status(200).json(others);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("Password mismatch");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json({ message: "User not found!!" });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SEC_KEY
    );
    const OrgPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OrgPassword != req.body.password &&
      res.status(401).json({ message: "wrong password!!!!" });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SEC,
      { expiresIn: "2d" }
    );

    const { password,cPassword, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
