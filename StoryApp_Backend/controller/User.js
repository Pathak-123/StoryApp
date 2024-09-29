const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const signupBody = zod.object({
    username: zod.string(),
    password: zod.string(),
  });

  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Please enter correct inputs",
    });
  }
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(411).json({
        success: false,
        message: "Username already taken, please try with another Username",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username,
      password: hash,
    });
    const token = jwt.sign(
      {
        _id: user._id,username: user.username
      },
      process.env.TOKEN_SECRET
    );

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.username}`,
      token: token,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  const signinBody = zod.object({
    username: zod.string(),
    password: zod.string(),
  });

  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success: false,
      message: "Please enter correct inputs",
    });
  }
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid username",
      });
    }

    const userPassword = bcrypt.compareSync(password, user.password);

    if (!userPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ _id: user._id,username: user.username }, process.env.TOKEN_SECRET);
    res.json({
       success: true,
      message: `Welcome, ${user.username}`,
      token,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { registerUser, loginUser };
