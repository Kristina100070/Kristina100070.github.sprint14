const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

const findUser = (req, res, next) => userModel.find({})
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    next(err);
  });

const findUserById = (req, res, next) => userModel.findOne({
  _id: req.params.userId,
}) // .select('+password')
// eslint-disable-next-line consistent-return
  .then((user) => {
    if (!user) {
      return next({ status: 404, massage: 'User not found' });
    }
    res.json(user);
  })
  .catch((err) => {
    next(err);
  });

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length < 8) {
    return res.status(400).send({ message: 'Пароль слишком короткий' });
  }
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch(() => res.status(403)
      .send({ message: 'Пользователь с таким email уже существует' }));
};

const login = (req, res) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (String(user._id) !== req.user._id) {
        return next({ status: 404, massage: 'Нет доступа для обновления' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (String(user._id) !== req.user._id) {
        return next({ status: 404, massage: 'Нет доступа для обновления' });
      }
      res.send({ data: user });
    })

    .catch((err) => {
      next(err);
    });
};

module.exports = {
  findUser,
  findUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
