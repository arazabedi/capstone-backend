import User from "../models/user.model.js";

export const logWeight = async (userId, logObject) => {
  try {
		const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    const logDate = new Date(logObject.date);
    console.log(logDate);
    // const isDuplicate = user.weight_log.some(
    //   (e) => {
    //     const entryDate = new Date(e.date);
    //     return (
    //       entryDate.getDate() === logDate.getDate() &&
    //       entryDate.getMonth() === logDate.getMonth() &&
    //       entryDate.getFullYear() === logDate.getFullYear()
    //     );
    //   }
    // );
    // if (!isDuplicate) {
    //   user.weight_log.push(logObject);
    //   await user.save();
    // }

    user.weight_log.push(logObject);
    await user.save();
  } catch (error) {
    throw error;
  }
};

export const getWeightLog = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return user.weight_log;
  } catch (error) {
    throw error;
  }
};

export const getNameFromId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    return user.full_name;
  } catch (error) {
    throw new Error("Error getting user's full name: " + error);
  }
};

export const getUsernameFromId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    return user.username;
  } catch (error) {
    throw new Error("Error getting details from id:" + error);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find().exec();
    return users;
  } catch (error) {
    throw new Error("Error retrieving users: " + error);
  }
};
