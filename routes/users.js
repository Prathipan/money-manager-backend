const router = require("express").Router();
const User = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");

router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cPassword: req.body.cPassword,
  });

  const existedUser = await User.findOne({ email: newUser.email });
  if (existedUser) {
    res.status(403).json("User Already exists");
  } else if (newUser.password == newUser.cPassword) {
    // newUser.password = CryptoJS.AES.encrypt(
    //   req.body.password,
    //   process.env.SEC_KEY
    // ).toString();
    // newUser.cPassword = newUser.password;
    try {
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email },
        process.env.JWT_SEC,
        { expiresIn: "2d" }
      );

      const verifyToken = await new Token({
        userId: savedUser._id,
        token: token,
      }).save();

      const url = `${process.env.Base_URL}user/${savedUser._id}/verify/${verifyToken.token}`;

      await sendEmail(savedUser.email, "Verify Email", url);

      const { password, cPassword, ...others } = savedUser._doc;
      res.status(200).json({ message: "Email sent for verification" });
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
    const OrgPassword = JSON.parse(hashedPassword.toString(CryptoJS.enc.Utf8));

    const checkPassword = JSON.parse(
      CryptoJS.AES.decrypt(req.body.password, process.env.SEC_KEY).toString(
        CryptoJS.enc.Utf8
      )
    );

    OrgPassword != checkPassword &&
      res.status(401).send({ message: "wrong password!!!!" });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SEC,
      { expiresIn: "2d" }
    );

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        const token = jwt.sign(
          { id: savedUser._id, email: savedUser.email },
          process.env.JWT_SEC,
          { expiresIn: "2d" }
        );

        const verifyToken = await new Token({
          userId: savedUser._id,
          token: token,
        }).save();

        const url = `${process.env.Base_URL}user/${savedUser._id}/verify/${verifyToken.token}`;

        await sendEmail(savedUser.email, "Verify Email", url);
        res.status(200).send("Email sent for for confirmation please verify");
      }
    }

    const { password, cPassword, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(401).json(error);
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).json({ message: "Invalid Link" });

    await User.findOneAndUpdate(
      { _id: user._id },
      { verified: true },
      { new: true }
    );
    await token.remove();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
