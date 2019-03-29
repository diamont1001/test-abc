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

 Date: 03/29/2019 14:45:26 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tb_article_tag`
-- ----------------------------
DROP TABLE IF EXISTS `tb_article_tag`;
CREATE TABLE `tb_article_tag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(64) DEFAULT '' COMMENT '标签名称',
  `weight` int(10) unsigned DEFAULT '0' COMMENT '优先级，可用于排序（大优先）',
  `count` bigint(20) unsigned DEFAULT '0' COMMENT '访问次数',
  `status` tinyint(3) unsigned DEFAULT '0' COMMENT '状态（0：下线，1：在线）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `tb_article_tag`
-- ----------------------------
BEGIN;
INSERT INTO `tb_article_tag` VALUES ('1', '口碑', '0', '0', '1'), ('2', '新车', '0', '0', '1'), ('3', '导购', '0', '0', '1'), ('4', '用车', '0', '0', '1'), ('5', '保养', '0', '0', '1'), ('6', '奇葩车闻', '0', '0', '1'), ('7', '驾驶技巧', '0', '0', '1'), ('8', '新手必备', '0', '0', '1'), ('9', '游记', '0', '0', '1'), ('10', '评测', '0', '0', '1'), ('11', '违章', '0', '0', '1'), ('12', '事故', '0', '0', '1'), ('14', '车文化', '0', '0', '1'), ('15', '品牌', '0', '0', '1'), ('16', '行业', '0', '0', '1'), ('17', '赛车', '0', '0', '1');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
