# test-abc

## 服务器项目情况

### Nginx

```bash
nginx -s reload
```

### mysql

开机会自动启动

### elasticsearch

`elasticsearch` 在 `nemo` 账号下运行，密码为 `111111`

```bash
su nemo
cd ~/lib/elasticsearch-5.5.1

# 后台启动服务
./bin/elasticsearch -d

# 停止服务
ps  -aux | grep  ela
kill -9 xxxx
```

### 25pin

```bash
# 启动服务
cd ../home/apps/test-abc/_jr_web/25pin
npm start

# 停止服务
cd ../home/apps/test-abc/_jr_web/25pin
npm stop
```

### cheduoxing

```bash
# 启动服务
cd ../home/apps/test-abc/_jr_web/cheduoxing
npm start

# 停止服务
cd ../home/apps/test-abc/_jr_web/cheduoxing
npm stop
```
