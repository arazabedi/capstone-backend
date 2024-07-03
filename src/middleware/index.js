import authJwt from "./authJwt.js";
import verifyRegistration from "./verifyRegistration.js";

const middlewareConfig = { authJwt, verifyRegistration };

export default middlewareConfig;
