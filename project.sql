/*
 Navicat Premium Dump SQL

 Source Server         : Project
 Source Server Type    : MySQL
 Source Server Version : 50724 (5.7.24)
 Source Host           : localhost:3306
 Source Schema         : project

 Target Server Type    : MySQL
 Target Server Version : 50724 (5.7.24)
 File Encoding         : 65001

 Date: 03/10/2025 13:49:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `full_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for amphures
-- ----------------------------
DROP TABLE IF EXISTS `amphures`;
CREATE TABLE `amphures`  (
  `id` int(11) NOT NULL,
  `name_th` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `province_id` int(11) NOT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for animal_categories
-- ----------------------------
DROP TABLE IF EXISTS `animal_categories`;
CREATE TABLE `animal_categories`  (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for animal_full_requests
-- ----------------------------
DROP TABLE IF EXISTS `animal_full_requests`;
CREATE TABLE `animal_full_requests`  (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` int(11) NOT NULL,
  `animal_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` enum('รออนุมัติ','อนุมัติ','ปฏิเสธ') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'รออนุมัติ',
  `reason` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_date` datetime NULL DEFAULT NULL,
  `category_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for animal_types
-- ----------------------------
DROP TABLE IF EXISTS `animal_types`;
CREATE TABLE `animal_types`  (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `animal_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for animal_usage
-- ----------------------------
DROP TABLE IF EXISTS `animal_usage`;
CREATE TABLE `animal_usage`  (
  `usage_id` int(11) NOT NULL AUTO_INCREMENT,
  `usage_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `usage_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`usage_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for animal_usage_detail
-- ----------------------------
DROP TABLE IF EXISTS `animal_usage_detail`;
CREATE TABLE `animal_usage_detail`  (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `usage_id` int(11) NOT NULL,
  `lot_id` int(11) NOT NULL,
  `quantity_used` int(11) NOT NULL DEFAULT 0,
  `action` enum('ตาย','ขาย','เชือด','อื่นๆ') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`detail_id`) USING BTREE,
  INDEX `fk_usage`(`usage_id`) USING BTREE,
  INDEX `fk_lot`(`lot_id`) USING BTREE,
  CONSTRAINT `fk_lot` FOREIGN KEY (`lot_id`) REFERENCES `farm_animals` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_usage` FOREIGN KEY (`usage_id`) REFERENCES `animal_usage` (`usage_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for animals
-- ----------------------------
DROP TABLE IF EXISTS `animals`;
CREATE TABLE `animals`  (
  `animal_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `category_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`animal_id`) USING BTREE,
  INDEX `fk_category_id`(`category_id`) USING BTREE,
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `animal_categories` (`category_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for comment_report
-- ----------------------------
DROP TABLE IF EXISTS `comment_report`;
CREATE TABLE `comment_report`  (
  `report_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` enum('รอดำเนินการ','ดำเนินการแล้ว') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'รอดำเนินการ',
  `report_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `post_id` int(11) NOT NULL,
  `report_review` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`farmer_id`, `comment_id`, `post_id`) USING BTREE,
  INDEX `comment_id`(`comment_id`) USING BTREE,
  INDEX `comment_report_ibfk_3`(`post_id`) USING BTREE,
  CONSTRAINT `comment_report_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comment_report_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comment_report_ibfk_3` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('แสดง','ซ่อน','ลบแล้ว') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'แสดง',
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `post_id`(`post_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for farm_animals
-- ----------------------------
DROP TABLE IF EXISTS `farm_animals`;
CREATE TABLE `farm_animals`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lot_code` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `type_id` int(11) NULL DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `quantity_received` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_farmer`(`farmer_id`) USING BTREE,
  INDEX `fk_animal`(`animal_id`) USING BTREE,
  INDEX `fk_type`(`type_id`) USING BTREE,
  CONSTRAINT `fk_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_type` FOREIGN KEY (`type_id`) REFERENCES `animal_types` (`type_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for farmer
-- ----------------------------
DROP TABLE IF EXISTS `farmer`;
CREATE TABLE `farmer`  (
  `farmer_id` int(11) NOT NULL COMMENT 'รหัสเกษตรกร (Primary Key)',
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'อีเมล',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสผ่าน',
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `farm_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ชื่อฟาร์ม',
  `tambon` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ตำบล',
  `amphure` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'อำเภอที่',
  `province` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'จังหวัดที่',
  `latitude` decimal(10, 7) NULL DEFAULT NULL COMMENT 'ละติจูด',
  `longitude` decimal(10, 7) NULL DEFAULT NULL COMMENT 'ลองจิจูด',
  `farm_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รูปภาพ',
  `farm_banner` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รูปแบนเนอร์',
  `status` enum('รออนุมัติ','อนุมัติ','ปฏิเสธ') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'รออนุมัติ' COMMENT 'สถานะการอนุมัติของฟาร์ม',
  `view_count` int(11) NULL DEFAULT 0 COMMENT 'จำนวนครั้งที่มีผู้เข้าชม',
  `is_active` enum('ปกติ','โดนระงับ') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'ปกติ' COMMENT 'สถานะบัญชีเกษตรกร',
  `create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_date` datetime NULL DEFAULT NULL,
  `update_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `reason` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`farmer_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางข้อมูลเกษตรกรและฟาร์ม' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for geographies
-- ----------------------------
DROP TABLE IF EXISTS `geographies`;
CREATE TABLE `geographies`  (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for guildbook
-- ----------------------------
DROP TABLE IF EXISTS `guildbook`;
CREATE TABLE `guildbook`  (
  `guildbook_id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `source_refs` json NULL,
  `tags` json NULL,
  PRIMARY KEY (`guildbook_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `news_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `owner_type` enum('admin','farmer') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `source_ref` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('แสดง','ซ่อน') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'แสดง',
  `reason_hide` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`news_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for post_report
-- ----------------------------
DROP TABLE IF EXISTS `post_report`;
CREATE TABLE `post_report`  (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` enum('รอดำเนินการ','ดำเนินการแล้ว') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'รอดำเนินการ',
  `report_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `report_review` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`report_id`) USING BTREE,
  INDEX `post_id`(`post_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  CONSTRAINT `post_report_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `post_report_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts`  (
  `post_id` int(11) NOT NULL COMMENT 'รหัสโพสต์',
  `farmer_id` int(11) NULL DEFAULT NULL COMMENT 'รหัสฟาร์ม',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `image_post` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `is_visible` enum('ซ่อน','เเสดง') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'เเสดง',
  `create_at` datetime NULL DEFAULT NULL,
  `update_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `approval_date` datetime NULL DEFAULT NULL,
  `hide_reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  CONSTRAINT `fk_posts_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `product_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `product_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`product_name`, `farmer_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces`  (
  `id` int(11) NOT NULL,
  `name_th` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `geography_id` int(11) NOT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tambons
-- ----------------------------
DROP TABLE IF EXISTS `tambons`;
CREATE TABLE `tambons`  (
  `id` int(11) NOT NULL,
  `zip_code` int(11) NOT NULL,
  `name_th` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amphure_id` int(11) NOT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
