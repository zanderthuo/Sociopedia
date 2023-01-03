import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** REGISTER USER */
export const register = async (req, res) => {
  try {
    // distructuring the body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;

    // hashing our users password using bcrypt
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // initialize new user details
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    });

    // save the new user
    const savedUser = await newUser.save();
    // if saved successfully return status code 201
    res.status(201).json(savedUser);
  } catch (error) {
    // return the error which mongoDB returns
    res.status(500).json({ error: err.message })
  }
}

/** Login User */
export const login = async (req, res) => {
  try {
    // distructuring credentials
    const { email, password } = req.body;

    // check for user in db and if no user throw an error
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: 'User does not exist.' })
    // compare the credentials on db with the one entered
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

    // Creating a login token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password;
    res.status(200).json({ token, user })

  } catch (error) {
    res.status(500).json({ error: err.message })
  }
}