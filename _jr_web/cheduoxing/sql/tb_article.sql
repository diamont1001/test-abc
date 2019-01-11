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

 Date: 01/11/2019 21:25:04 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tb_article`
-- ----------------------------
DROP TABLE IF EXISTS `tb_article`;
CREATE TABLE `tb_article` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自动增ID',
  `title` varchar(64) DEFAULT '' COMMENT '文章标题',
  `keywords` varchar(128) DEFAULT NULL,
  `summary` text COMMENT '文章摘要',
  `content` mediumtext COMMENT '文章内容',
  `tags` varchar(64) DEFAULT '' COMMENT '标签ID列表，多个使用","分开，每个对应 tb_article_tag.id',
  `images` varchar(2048) DEFAULT '' COMMENT '列表展示的图片列表',
  `video` varchar(1024) DEFAULT '' COMMENT '视频链接',
  `author` varchar(64) DEFAULT '',
  `app` varchar(128) DEFAULT '' COMMENT '关联应用（packageName）',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `publish_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `update_operator` varchar(64) DEFAULT '' COMMENT '更新操作人',
  `status` tinyint(3) unsigned DEFAULT '0' COMMENT '状态（0：草稿，1：已发布，2：已下线，3：回收站，4：已删除）',
  `verify_state` tinyint(3) unsigned DEFAULT '0' COMMENT '审核状态（0：待审核，1：审核通过，2：审核不通过）',
  `count` bigint(20) unsigned DEFAULT '0' COMMENT '访问次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10013233 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
