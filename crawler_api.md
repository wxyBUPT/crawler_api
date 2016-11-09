
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


