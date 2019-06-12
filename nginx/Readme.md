## 配置 Nginx

### IP黑名单

IP黑名单的配置文件为 `blocksip.conf`。

由于该配置文件是自定义的，针对新的 Nginx 配置，需要手动添加 `blocksip.conf` 的引用，在 `/etc/nginx/nginx.conf` 添加：

```
...

http{
  ...
  include /etc/nginx/blocksip.conf;
  ...
}
...
```

### 网站常规配置

常规配置文件为 `sites-available/default`，阿里云机器上的全路径为 `/etc/nginx/sites-available/sites-available/default`。

```bash
$ cd /etc/nginx/sites-available
$ vi default
```

### Nginx 重启

修改完配置后，需要重新 Nginx 才可以生效。

```bash
# 进入 Nginx 安装目录
$ cd /etc/nginx/sites-available

# 重启 Nginx
$ nginx -s reload
```
