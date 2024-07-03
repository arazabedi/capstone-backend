import { createClient } from "redis";

let redisClient = undefined;

export const initialiseRedisClient = async () => {
  let redisURL = process.env.REDIS_URI;

  if (redisURL) {
    redisClient = createClient({ url: redisURL }).on("error", (e) => {
      console.error(`Failed to create the Redis client with error:`);
      console.error(e);
    });

    try {
      await redisClient.connect();
      console.log(`Connected to Redis successfully!`);
      return redisClient;
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  } else {
    console.log("Error: No redis url");
  }
};

export const isRedisWorking = async () => {
  return !!redisClient?.isOpen;
};

export const addToBlacklist = async (token) => {
  try {
    await redisClient.sAdd("blacklist", token);
  } catch (error) {
    console.log("Error adding token to blacklist");
    throw error;
  }
};

export const isTokenBlacklisted = async (token) => {
  try {
    const matches = await redisClient.SISMEMBER("blacklist", token);
    if (matches > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error checking token against blacklist");
    throw error;
  }
};

// Placeholder function - to be replaced with functionality that removes tokens after one hour
export const resetBlacklist = async () => {
  try {
    await redisClient.del("blacklist");
    console.log("Blacklist reset");
  } catch (error) {
    console.log("Error resetting blacklist");
  }
};

