import mongoose from "mongoose";
import User from "./user.model.js";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;

export default db;
