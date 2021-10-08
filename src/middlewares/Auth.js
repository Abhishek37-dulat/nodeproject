import { verify } from "jsonwebtoken";
import constants from "../constants.json";

const isAdmin = (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token)
      return res
        .status(401)
        .json({ error: constants.authError.unauthenticated });

    const verified = verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({ error: constants.authError.unauthorized });
    if (verified.role === "admin") {
      req.user = verified.role;
      next();
    } else
      return res.status(403).json({ error: constants.authError.unauthorized });
  } catch (err) {
    return res.status(500).json({
      error: constants.error.unexpected,
      info: err.message,
    });
  }
};

export default isAdmin;