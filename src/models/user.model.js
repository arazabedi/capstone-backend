import mongoose from "mongoose";

const User = mongoose.model(
  `User`,
  new mongoose.Schema({
		username: String,
		full_name: {},
    email: String,
		password: String,
		sent_requests: [],
		friend_requests: [],
    friends: [],
    weight_log: [],
  })
);

export default User;
