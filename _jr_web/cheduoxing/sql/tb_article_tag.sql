/*
 Navicat MySQL Data Transfer

 Source Server         : ECS-1-1-20
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : 47.106.209.94
 Source Database       : cheduoxing

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : utf-8

 Date: 01/11/2019 21:25:12 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tb_article_tag`
-- ----------------------------
DROP TABLE IF EXISTS `tb_article_tag`;
CREATE TABLE `tb_article_tag` (
  `id` bigint(20) unsigned NOT NULL COMMENT '标签ID',
  `name` varchar(64) DEFAULT '' COMMENT '标签名称',
  `count` bigint(20) unsigned DEFAULT '0' COMMENT '访问次数',
  `status` tinyint(3) unsigned DEFAULT '1' COMMENT '状态（0：下线，1：在线）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
