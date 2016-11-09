
# crawler_api

## [api/xmly/topn](#xmly_topn)

<p id="xmly_topn">告知爬虫爬取喜马拉雅网站的topn</p>

api/xmly/topn

控制爬虫爬取喜马拉雅一个专辑内的topn与获取当前状态信息

### 支持格式

JSON

### 获得当前爬虫状态

#### http 请求方式

GET

#### 请求参数

无

#### 返回结果

**JSON示例**

```javascript
{
    name:'xmly_topn',
    description:"Not started",
    // description: 'pid 6343, uptime 5 days, 7:02:05',
    start:0,
    stop:0,
    now:1200361812,
    state:20,
    statename:'RUNNING'
}
```

### 触发服务器执行一次xmly topn 的爬取,如果服务器正在爬取则失败

#### http请求方式

POST

#### 请求参数

| 参数名 | 类型及范围 | 说明|
| --- | ---| ---|
| topn_n | int(1~100) | topn_n n的数目, 爬虫目前设计只支持 1 ~ 100 的爬取|
| urls | list | xmly 需要爬取栏目的url列表,如果为空,则全部爬取|


