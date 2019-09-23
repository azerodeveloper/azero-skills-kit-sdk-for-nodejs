
#  AZERO SDK for nodejs

这是一个帮助开发Skill的SDK，我们强烈建议您使用这个SDK开发Azero Skill。通过下载该azero nodejs sample，以此为基础可以迅速的开发一个skill

## 下面通过一个例子来完整的说明如何使用该sdk来完成一个azero技能的开发

### 可根据自己需要修改start.js入口文件，具体内容如下


```python
var app= require('express')();
var express= require('express');
// 引入json解析中间件
var bodyParser = require('body-parser');


//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//配置服务端口
var server = app.listen(4001, function () {
  var host = server.address().address;
  var port = server.address().port;
})

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
app.post('/azero/:skillId', function (req, res) {//第二个参数是用一种解析方式解析
  // console.log(req.body);//{ age: '20', name: 'lambo' }---body是从客户端传过来的参数
  res.writeHeader(200, {'Content-Type':'application/json;charset=UTF-8'});
  let skill = require('./'+req.originalUrl);
  skill.handler(req.body, null, (error, result) => {
    var json = JSON.stringify(result, null, 2);
    res.end(json);
  });
});
```

### 在azero目录下创建一个index.js


```python
const azero = require('./azero-sdk');
const azero_sdk = azero.sdk;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return azero.getRequestType(handlerInput) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const BOOKAIRPORT_IntentRequestHandler = {
    canHandle(handlerInput) {
        return azero.getIntentConfirm(handlerInput,'BOOKAIRPORT');
    },
    handle(handlerInput) {
        let slot = azero.getSlotValue(handlerInput,"SlotName");//获取所有Slot对象内容
        let jsonObject = JSON.parse(slot);
        let slotNames = jsonObject.parameters;//获取所有AZERO配置的槽位值
        let speakOutput = jsonObject.answer;//获取NLP返回的answer
        if(speakOutput ==null || speakOutput.length<1){
            speakOutput = '欢迎使用技能';
        }
        return handlerInput.responseBuilder
            .addRenderTemplateDirective({//设置返回端上的模版格式
                type: `BodyTemplate1`,
                title: speakOutput,
                textContent: {
                    "primaryText": {
                        "text": speakOutput,
                        "type": "string"
                    }
                }
            })
            .speak(speakOutput)//返回端上的语音播报内容
            .withSimpleCard('Hello World', speechText)//返回端上的卡片内容
            .withShouldEndSession(true)//多伦对话结束设为true，否则为false
            .getResponse();//返回response
    }
};

const IntentRequestHandler = {
    canHandle(handlerInput) {
        return azero.getIntentRequest(handlerInput);
    },
    handle(handlerInput) {
        let slot = azero.getSlotValue(handlerInput,"SlotName");
        let jsonObject = JSON.parse(slot);
        let speakOutput = jsonObject.answer;
        if(speakOutput ==null || speakOutput.length<1){
            speakOutput = '欢迎使用技能';
        }
        return handlerInput.responseBuilder
            .addRenderTemplateDirective({
                type: `BodyTemplate1`,
                title: speakOutput,
                textContent: {
                    "primaryText": {
                        "text": speakOutput,
                        "type": "string"
                    }
                }
            })
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return azero.getRequestType(handlerInput) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const SampleResponseInterceptor = {
    process(handlerInput) {
        return new Promise((resolve, reject) => {
            handlerInput.attributesManager.savePersistentAttributes()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

const SampleRequestInterceptor = {
    process(handlerInput) {
        return new Promise((resolve, reject) => {
            handlerInput.attributesManager.savePersistentAttributes()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = azero_sdk.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BOOKAIRPORT_IntentRequestHandler,
        IntentRequestHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(
//        SampleRequestInterceptor
    )
    .addResponseInterceptors(
//        SampleResponseInterceptor
    )
    .addErrorHandlers(
        ErrorHandler
    ).lambda();
```

#### index.js是技能的逻辑处理模块
* LaunchRequestHandler是针对封闭式技能添加技能唤醒的处理函数（目前AZERO开发者网站支持开放式技能，不需该处理函数）, 一般是是关于本技能介绍的欢迎语或者关于使用方法的介绍。 
* IntentRequestHandler是公共意图的处理函数，若意图request没有匹配到对应的意图Handler则执行该函数逻辑。
* BOOKAIRPORT_IntentRequestHandler是根据AZERO平台创建skill时配置的自定义意图名称自动生成的Handler处理函数，在进行该意图请求时，请求参数里一般包含相关的槽位信息，槽位是用户意图的关键信息，进行意图的逻辑处理时会使用到， 一般在使用之前会进行是否为空的判断。所有的逻辑处理函数的返回结果可以是json Object 也可以是Promise包裹的json Object。 示例中的处理逻辑比较简单，只做演示使用，用户可以根据自己的需求进行逻辑的扩展以及模块的封装。
* SessionEndedRequestHandler是在会话结束之后执行该处理函数
* ErrorHandler是在调用技能处理逻辑报错时会执行该处理函数
* SampleRequestInterceptor是request的拦截器处理函数
* SampleResponseInterceptor是response的拦截器处理函数

#### Demo中azero_sdk提供两种方式创建Handler


```python
const customSkillBuilder = azero_sdk.SkillBuilders.custom();
const standardSkillBuilder = azero_sdk.SkillBuilders.standard();
```

##### 创建的Handler可以支持以下方法：


```python
addRequestHandler(matcher : ((handlerInput : HandlerInput) => Promise<boolean> | boolean) | string, executor : (handlerInput : HandlerInput) => Promise<Response> | Response) : this;
addRequestHandlers(...requestHandlers : RequestHandler[]) : this;
addRequestInterceptors(...executors : Array<RequestInterceptor | ((handlerInput : HandlerInput) => Promise<void> | void)>) : this;
addResponseInterceptors(...executors : Array<ResponseInterceptor | ((handlerInput : HandlerInput, response? : Response) => Promise<void> | void)>) : this;
addErrorHandler(matcher : (handlerInput : HandlerInput, error : Error) => Promise<boolean> | boolean, executor : (handlerInput : HandlerInput, error : Error) => Promise<Response> | Response) : this;
addErrorHandlers(...errorHandlers : ErrorHandler[]) : this;
withCustomUserAgent(customUserAgent : string) : this;
withSkillId(skillId : string) : this;
getSkillConfiguration() : SkillConfiguration;
create() : Skill;
lambda() : LambdaHandler;
```

#### Demo中azero支持以下方法：


```python
getLocale(handlerInput): string;
getRequestType(handlerInput): string;
getIntentName(handlerInput): string;
getAccountLinkingAccessToken(handlerInput): string;
getApiAccessToken(handlerInput): string;
getDeviceId(handlerInput): string;
getUserId(handlerInput): string;
getDialogState(handlerInput): string;
getSlot(handlerInput): Slot;
getSlotValue(handlerInput): string;
getSupportedInterfaces(handlerInput): SupportedInterfaces;
isNewSession(handlerInput): boolean;
getIntentRequest(handlerInput):boolean;
getIntentConfirm(handlerInput,intentName):boolean;
```

### 运行AZERO nodejs
* node start.js

## Template展现模版 
* 为了更好的在有屏设备端上展现技能，AZERO提供了多种展现模板供开发者使用。展现模板分body template和list template两种类型。其中body template由图片和文字组成，list template由一系列list item组成，每个list item由图片和文字组成。不同的展现模板适合不同的场景，开发者可以根据技能展现的需求选择合适的模板
* 添加返回端上的模版方法包含addRenderTemplateDirective


### BodyTemplate 共有5种类型模板可供选择

#### 文本展现模板 BodyTemplate1
* 此模板适用于展示纯文本信息场景，包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * textContent:技能交互时界面展示的文本信息
      * 一级文本:primaryText
      * 二级文本:secondaryText(可选)
      * 三级文本:tertiaryText(可选)


```python
{
  "type":"BodyTemplate1",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": Image,
  "title": "string",
  "textContent": TextContent
}
```

#### 图片和文本展现模板 BodyTemplate2
* 此模板适用于同时展示图片和文字的使用场景，其中图片展现在屏幕右侧，文字展现在屏幕左侧。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * image:展示的图片
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * textContent:技能交互时界面展示的文本信息
      * 一级文本:primaryText
      * 二级文本:secondaryText(可选)
      * 三级文本:tertiaryText(可选)


```python
{
  "type":"BodyTemplate2",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": Image,
  "title": "string",
  "image": Image,
  "textContent": TextContent
}
```

#### 图片和文本展现模板 BodyTemplate3
* 此模板适用于同时展示图片和文字的使用场景，其中图片展现在屏幕左侧，文字展现在屏幕右侧。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * image:展示的图片
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * textContent:技能交互时界面展示的文本信息
      * 一级文本:primaryText
      * 二级文本:secondaryText(可选)
      * 三级文本:tertiaryText(可选)


```python
{
  "type":"BodyTemplate3",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": Image,
  "title": "string",
  "image": Image,
  "textContent": TextContent
}
```

#### 图片和文本展现模板 BodyTemplate4
* 此模板适用于展示文字和背景图片使用场景，其中背景图片可在屏幕区域内进行自适应展示。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * image:展示的图片
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * textContent:技能交互时界面展示的文本信息
      * 一级文本:primaryText
      * 二级文本:secondaryText(可选)
      * 三级文本:tertiaryText(可选)


```python
{
  "type":"BodyTemplate4",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": Image,
  "title": "string",
  "image": Image,
  "textContent": TextContent
}
```

#### 图片展现模板 BodyTemplate5
* 此模板适用于展示可缩放的前景图片以及带有背景图片的使用场景。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * image:展示的图片
  * backgroundImage:技能交互时作为背景展示的图片（可选）


```python
{
  "type":"BodyTemplate5",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": Image,
  "title": "string",
  "image": Image
}
```

### ListTemplate 共有2种类型模板可供选择

#### ListTemplate1
* 此模板是纵向列表模板，适用于展现纵向的文本和图片场景。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * listItems:列表项，包含文本和图片信息
    * token:图片的序号
    * image:背景图片
    * textContent:
        * 一级文本:primaryText
        * 二级文本:secondaryText(可选)
        * 三级文本:tertiaryText(可选)


```python
{
  "type": "ListTemplate1",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": "Image",
  "title": "string",
  "listItems": [
    {
      "token": "string",
      "image": Image,
      "textContent": TextContent
    },
    ...
    ...
    {
      "token": "string",
      "image": Image,
      "textContent": TextContent
    }
  ]
}
```

#### ListTemplate2
* 此模板是横向列表模板，适用于展现横向的文本和图片场景。包含以下内容：
  * title:技能名称或者技能当前页面主题
  * token:模板的唯一标识
  * backButton:开发者在技能发布时需进行上传(可选)，返回按钮(展示/隐藏)
  * backgroundImage:技能交互时作为背景展示的图片（可选）
  * listItems:列表项，包含文本和图片信息
    * token:图片的序号
    * image:背景图片
    * textContent:
        * 一级文本:primaryText
        * 二级文本:secondaryText(可选)


```python
{
  "type": "ListTemplate2",
  "token": "string",
  "backButton": "VISIBLE"(default) | "HIDDEN",
  "backgroundImage": "Image",
  "title": "string",
  "listItems": [
    {
      "token": "string",
      "image": Image,
      "textContent": TextContent
    },
    ...
    ...
    {
      "token": "string",
      "image": Image,
      "textContent": TextContent
    }
  ]
}
```

## 如何调试
* 调试可以在本地进行调试,也可在借助AZERO平台的在线调试工具进行调试。

### 本地测试
* 本地调试需要构造格式正确的的Request入参，可以参考如下json数据格式修改，把本地的AZERO nodejs服务启动起来(node start.js),然后借助postman本地请求进行开发调试(localhost:4001/azero/index)。


```python
{
	"version": "1.0",
	"session": {
		"new": true,
		"sessionId": "token.domain-api.session.5d2410cd267sds0908cfad1b",
		"application": {
			"applicationId": "dad5e38cc023456fsaafd6ac869ff448"
		},
		"user": {
			"userId": "sample-demo"
		}
	},
	"context": {
		"System": {
			"application": {
				"applicationId": "dad5e38cc023456fsaafd6ac869ff448"
			},
			"user": {
				"userId": "sample-demo"
			},
			"device": {
				"deviceId": "sample-demo12345678",
				"supportedInterfaces": {}
			}
		}
	},
	"request": {
		"intent": {
			"name": "BOOKAIRPORT",
			"slots": {
				"SlotName": {
					"name": "SlotName",
					"value": "{\"result\":{\"text\":\"我想定机票\",\"type\":\"dialog\"},\"outputs\":[{\"property\":{\"text\":\"hello\"},\"type\":\"wechat.text\"},{\"property\":{\"emotion\":\"positive\",\"text\":\"我想定机票\"},\"type\":\"dialog\"}],\"app_key\":\"16e8765d-2353-461b-9e04-4e0d07370cc2\",\"answer\":\"定哪一天的机票\",\"query\":\"我想定机票\",\"name\":\"bookairport\",\"action\":\"dialog\",\"parameters\":{\"src_city\":\"北京\"}}"
				}
			}
		},
		"type": "IntentRequest",
		"requestId": "ce8ada85-63ec-4382-aae8-2d50ba427d9e",
		"timestamp": "2019-09-13T11:26:33.547Z"
	}
}
```

### AZERO平台测试
* 将本地调试OK的index.js中的各个模块的业务逻辑代码复制到AZERO平台的服务部署代码编辑中，进行服务部署，并使用模拟测试功能进行线上调试（注：因线上环境azero-sdk进行了封装，请将本地调试的index.js中的const azero = require('./azero-sdk')上线时改为const azero = require('azero-sdk')）
