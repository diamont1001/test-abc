# test-abc

## 基础服务部署

### Nginx

```bash
nginx -s reload
```

### mysql

开机会自动启动

### elasticsearch

更多操作可以参考：【[全文搜索引擎 Elasticsearch 入门教程](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)】

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

查看当前节点的所有 `Index`：

```bash
curl -X GET 'http://localhost:9200/_cat/indices?v'
```

查询每个 `Index` 所包含的 `Type`：

```bash
curl 'localhost:9200/_mapping?pretty=true'
```

新建一个名叫 `abc` 的 `Index`：

```bash
curl -X PUT 'localhost:9200/xxx'
```

删除一个名叫 `abc` 的 `Index`：

```bash
$ curl -X DELETE 'localhost:9200/abc'
```

## 项目部署

### 25pin.com

```bash
# 启动服务
cd ../home/apps/test-abc/_jr_web/25pin
npm start

# 停止服务
cd ../home/apps/test-abc/_jr_web/25pin
npm stop
```

### cheduoxing.com

```bash
# 启动服务
cd ../home/apps/test-abc/_jr_web/cheduoxing
npm start

# 停止服务
cd ../home/apps/test-abc/_jr_web/cheduoxing
npm stop
```
