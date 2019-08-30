/**
 * 接口返回码
 */

const ERROR_CODE = {
  // 成功
  OK: 0,
  
  // 参数错误
  PARAMS_ERROR: 50000,
  
  // 用户不存在
  USER_NOT_EXIST: 50001,
  
  // 用户被禁用
  USER_FORBIDDEN: 50002,
  
  // 手机号码不正确
  USER_PHONE_ERROR: 50003,
  
  // 账号或密码错误
  USER_PWD_ERROR: 50004,
  
  // 用户注册失败
  USER_REG_ERROR: 50101,
  
  // 验证码错误
  USER_VERIFY_CODE_ERROR: 50102,
  
  // 手机号码已注册
  USER_PHONE_EXIST: 50103,
  
  // 发送短信验证码失败
  USER_SENDCODE_ERROR: 50201,
  
  // 发送短信过于频繁
  USER_SENDCODE_FREQUENT: 50202,
  
  // 重置密码失败
  USER_RESET_PASSWORD_ERROR: 50301,
  
  // 旧密码错误
  USER_OLD_PASSWORD_ERROR: 50302,
  
  // 用户更新失败
  USER_UPDATE_ERROR: 50501,
  
  // 用户关注失败
  USER_FOLLOW_ERROR: 50601,
  
  // 浆糊动态保存失败
  POST_SAVE_FAIL: 51001,
  
  // 浆糊动态内容为空
  POST_CONTENT_EMPTY: 51002,
  
  // 浆糊动态不存在
  POST_NOT_EXIST: 51003,
  
  // 浆糊动态点赞失败
  POST_LIKE_ERROR: 51101,
  
  // 删除浆糊动态失败
  POST_DELETE_FAIL: 51201,
  
  // 无权限删除浆糊动态
  POST_DELETE_REJECT: 51202,
  
  // 发表评论失败
  COMMENT_SAVE_FAIL: 52101,
  
  // 评论内容为空
  COMMENT_CONTENT_EMPTY: 52102,
};

export default ERROR_CODE;
