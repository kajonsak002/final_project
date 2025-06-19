const express = require("express");
const {
  login,
  register,
  adminLogin,
  adminRegister,
  check_token,
} = require("../controllers/auth");
const authToken = require("../middleware/auth_token");
const router = express.Router();
const uploadTo = require("../middleware/upload");

const uploadImgFarm = uploadTo("farm_profile");

router.post("/login", login);
router.post(
  "/register",
  uploadImgFarm.fields([
    { name: "farm_img", maxCount: 1 },
    { name: "farm_banner", maxCount: 1 },
  ]),
  register
);

router.post("/admin/login", adminLogin);
router.post("/admin/register", adminRegister);
router.get("/admin/check_token", authToken, check_token);

module.exports = router;
