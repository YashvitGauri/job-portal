import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getRegister = (req, res) => {
  res.render('pages/register');
};

export const postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    req.session.userEmail = newUser.email;
    req.session.role = newUser.role;

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Registration failed');
  }
};

export const getLogin = (req, res) => {
  res.render('pages/login');
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Incorrect password');

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.role = user.role;
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Login failed');
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
