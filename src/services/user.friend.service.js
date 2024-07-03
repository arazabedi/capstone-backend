import User from "../models/user.model.js";
import {
  getWeightLog,
  getNameFromId,
  getUsernameFromId,
} from "./user.service.js";

// This should really just exist as a built in function
Array.prototype.delete = function (element) {
  let index = this.indexOf(element);
  if (index !== -1) {
    this.splice(index, 1);
  }
};

export const getAllFriends = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    return user.friends;
  } catch (error) {
    throw error;
  }
};

export const getAllFriendWeightLogs = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    let friendWeightLogs = [];
    for (const friendId of user.friends) {
      const friendLog = await getWeightLog(friendId);
      const friendName = await getNameFromId(friendId);
      const friendUsername = await getUsernameFromId(friendId);
      friendWeightLogs.push({
        friend_id: friendId,
        friend_username: friendUsername,
        friend_name: friendName,
        weight_log: friendLog,
      });
    }
    console.log(friendWeightLogs);
    return friendWeightLogs;
  } catch (error) {
    throw error;
  }
};

export const becomeFriends = async (senderId, receiverId) => {
  try {
    const user = await User.findOne({ _id: senderId }).exec();
    user.friends.push(receiverId);
    user.sent_requests.delete(receiverId);
    await user.save();
    const friend = await User.findOne({ _id: receiverId }).exec();
    friend.friends.push(senderId);
    friend.friend_requests.delete(senderId);
    await friend.save();
  } catch (error) {
    throw new Error("Error adding friend:" + error);
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (user.friends.includes(friendId)) {
      user.friends.delete(friendId);
      await user.save();
      const friend = await User.findOne({ _id: friendId }).exec();
      console.log("Friend: " + friend);
      friend.friends.delete(userId);
      await friend.save();
    } else {
      throw new Error("Friend not found");
    }
  } catch (error) {
    throw new Error("Error deleting friend:" + error);
  }
};

export const sendFriendRequest = async (userId, friendId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (user.sent_requests.includes(friendId)) {
      throw new Error("Request already sent");
    }
    user.sent_requests.push(friendId);
    await user.save();
    const friend = await User.findOne({ _id: friendId }).exec();
    friend.friend_requests.push(userId);
    await friend.save();
  } catch (error) {
    throw new Error("Error sending friend request: " + error);
  }
};

export const deleteFriendRequest = async (userId, requestId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    user.friend_requests.findIndex(requestId);
    user.friend_requests.splice(requestId, 1);
    await user.save();
  } catch (error) {
    throw new Error("Error deleting friend request:" + error);
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    return user.friend_requests;
  } catch (error) {
    throw new Error("Error getting friend request:" + error);
  }
};

export const getSentFriendRequests = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    return user.sent_requests;
  } catch (error) {
    throw new Error("Error getting sent friend request:" + error);
  }
};
