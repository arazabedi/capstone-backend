import db from "../models/index.js";

const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const usernameUser = await User.findOne({
      username: req.body.username,
    }).exec();
    if (usernameUser) {
      res.status(400).send({ message: `Failed! Username is already in use!` });
      return;
    }

    const emailUser = await User.findOne({ email: req.body.email }).exec();
    if (emailUser) {
      res.status(400).send({ message: `Failed! Email already in use` });
      return;
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const verifyRegistration = {
  checkDuplicateUsernameOrEmail,
};

export default verifyRegistration;
