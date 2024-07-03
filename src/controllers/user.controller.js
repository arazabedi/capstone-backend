import {
  logWeight,
  getWeightLog,
  getNameFromId,
  getAllUsers,
} from "../services/user.service.js";

import {
  getAllFriends,
  becomeFriends,
  removeFriend,
  sendFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  getAllFriendWeightLogs,
} from "../services/user.friend.service.js";

// Special for dev purposes - not to be used as insecure
export const getAllUsersController = async (req, res) => {
  try {
    const response = await getAllUsers();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logWeightController = async (req, res) => {
  const userId = req.userId;
  const { logObject } = req.body;
  try {
    await logWeight(userId, logObject);
    res.status(200).send({ message: "Weight logged successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to log weight: " + error });
  }
};

export const getWeightLogController = async (req, res) => {
  const userId = req.userId;
  try {
    const weightLog = await getWeightLog(userId);
    res.status(200).json(weightLog);
	} catch (error) {
    res.status(500).send({ error: "Failed to get weight log" });
  }
};

export const searchForFriendsController = async (req, res) => {
  const searchParams = await req.query.params;
  try {
		const users = await getAllUsers();
    let filteredUsers = [];
    filteredUsers = users.filter((e) => {
      console.log(e);
      return (
        (e.full_name.middle_name &&
          e.full_name.middle_name
            .toLowerCase()
            .includes(searchParams.toLowerCase())) ||
        e.full_name.first_name
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        e.full_name.last_name
          .toLowerCase()
          .includes(searchParams.toLowerCase()) ||
        e.username.toLowerCase().includes(searchParams.toLowerCase()) ||
				e.email.toLowerCase().includes(searchParams.toLowerCase()) ||
				e._id.equals(searchParams)
      );
    });
    const strippedFilteredUsers = [];
    filteredUsers.forEach((user) => {
      const userInfo = {};
      userInfo._id = user._id;
      userInfo.full_name = user.full_name;
      userInfo.username = user.username;
      userInfo.email = user.email;
      strippedFilteredUsers.push(userInfo);
    });
    res.status(200).json(strippedFilteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendFriendRequestController = async (req, res) => {
  const userId = req.userId;
	const friendId = req.body.request_id;
  try {
    await sendFriendRequest(userId, friendId);
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).send({ error: "Failed to send friend request " + error });
  }
};

export const acceptFriendRequestController = async (req, res) => {
  const receiverId = req.userId;
  const senderId = req.body.request_id;
  try {
    await becomeFriends(senderId, receiverId);
    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to accept friend request " + error });
  }
};

export const removeFriendController = async (req, res) => {
  const userId = req.userId;
  const friendId = req.body.friend_id;
  try {
    await removeFriend(userId, friendId);
    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to remove friend request " + error });
  }
};

export const getFriendRequestsController = async (req, res) => {
  try {
    const userId = req.userId;
    const friendRequests = await getFriendRequests(userId);
    res.status(200).send(friendRequests);
  } catch (error) {
    res.status(500).send({ error: "Failed to get friend requests" + error });
  }
};

export const getSentFriendRequestsController = async (req, res) => {
  try {
    const userId = req.userId;
    const sentFriendRequests = await getSentFriendRequests(userId);
    res.status(200).json(sentFriendRequests);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to get sent friend request" + error });
  }
};

export const getAllFriendWeightLogsController = async (req, res) => {
  try {
    const userId = req.userId;
    const friendWeightLogs = await getAllFriendWeightLogs(userId);
    res.status(200).json(friendWeightLogs);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to get sent friend request" + error });
  }
};
