
# crawler_api

## api/*/topn
**其中 \* 代表(xmly\kl\qt\)**

<p id="*_topn">告知爬虫爬取喜马拉雅网站的topn</p>

api/*/topn

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

*正在执行示例*
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

*爬虫进程停止执行示例*
```javascript
{
  "description": "Not started",
  "stop": 0,
  "exitstatus": 0,
  "now": 1478700847,
  "name": "xmly_topn",
  "statename": "STOPPED",
  "start": 0,
  "state": 0
}
```

### 触发服务器执行一次xmly topn 的爬取,如果服务器正在爬取则失败

#### http请求方式

POST

#### 请求参数(application/json)

| 参数名 | 类型及范围 | 说明|
| --- | ---| ---|
| topn_n | int(1~100) | topn_n n的数目, 爬虫目前设计只支持 1 ~ 100 的爬取|
| urls | array | xmly 需要爬取栏目的url列表,如果为空,则全部爬取|

*示例*
```javascript
{
	"topn_n":10,
	"urls":[]
}
```

#### 返回结果

**JSON示例**

*成功调用**

```javascript
{
  "description": "",
  "stop": 0,
  "exitstatus": 0,
  "now": 1478868034,
  "name": "qt",
  "statename": "STARTING",
  "start": 1478868034,
  "state": 10,
  "status": "success"
}
```

*失败调用*

```javascript
{
    status:"fail",
    reason:"stillrunning"
    // or
    // reason:"Please start latter"
}
```

### 停止服务器的xmly topn 的爬取

#### http请求方式

DELETE

#### 返回结果

#### 请求参数(application/json)

只有一个可选参数 sigint,如果为true,则向进程发送sigint信号,建议使用此种方式调用,进程会保存报表信息,如果无参数则效果等同于 kill -9
使用sigint 参数返回值都为true

*示例*
```javascript
{
	"sigint":true
}
```


**kill -9返回值JSON示例**

*成功调用*

```javascript
{
    status:"success"
}
```

*失败调用* 

```javascript
{
    status:"not_running"
}
```
