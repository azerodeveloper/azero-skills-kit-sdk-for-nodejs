const azero = require('azero-sdk');
const azero_sdk = azero.sdk;
const log = require('azero-sdk-logger');
//*引入BD持久化包
const {MongoDbPersistenceAdapter, PartitionKeyGenerators} = require('azero-sdk-mongodb-persistence-adapter');
let persistenceAdapter;

/**
 * 所有技能handler执行前执行的Interceptor
 * @type {{canHandle(*): *, handle(*): *}}
 */
const RequestInterceptor = {
    process(handlerInput) {
        log.info('进入Interceptor处理方法中...',handlerInput.requestEnvelope);
        if (persistenceAdapter == undefined) {
            //初始化persistenceAdapter
            persistenceAdapter = new MongoDbPersistenceAdapter({
                tableName: 'dbName', //要创建的表名
                partitionKeyName: 'userId', //查询关键字 不写默认为id
                attributesName: 'attributes', //查询对象，不写默认为attributes
                partitionKeyGenerator: PartitionKeyGenerators.userId//partitionKeyName的值默认为userid
            });
        }
        log.info('Interceptor初始化完成...',handlerInput.requestEnvelope);
    }
}
/**
 Azero系统根据您自定义意图的意图标识以及您意图选用了禁用自动委派，自动生成此函数。
 若您的交互不涉及多轮对话(一问一答即完成对话)或对话交互业务复杂度可以完全委托给Azero系统根据前端意图配置中的澄清话术、意图确认等处理整个对话，建议您开启自动委派
 功能，忽略此函数。
 canhandle:判断传入此意图的请求是否要被此函数处理。默认判断规则为:请求中的意图标识与本意图标识匹配，且用户与技能对话交互还处于中间状态(DialogState为STARTED或IN_PROGRESS)。
 handle:当canhandle返回为true时,自动执行。由于意图禁用了自动委派，那么用户与技能对话交互过程，若有澄清话术，意图确认等需求，Azero会把此类请求传入此函数，您
 可以在此通过代码，手动对澄清话术，验证槽位，确定槽位和确定意图等业务做特殊处理。
 用户与技能对话交互过程(DialogState)，有三种状态:STARTED、IN_PROGRESS、COMPLETED。
 若完成当前意图后希望转到新意图withShouldEndSession需设为false，且需返回Dialog的Directive。
 */
const  CombineDialogDelegateHandler_test = {
    canHandle(handlerInput) {
        return azero.getIntentConfirm(handlerInput,'CombineDialogDelegate')
            && (azero.getDialogState(handlerInput)==='STARTED'
                || azero.getDialogState(handlerInput)==='IN_PROGRESS');
    },
    handle(handlerInput) {
        let currentIntent = handlerInput.requestEnvelope.request.intent;
        let speakOutput = '您可根据判断意图或者所有槽位返回您想回复的话术和模版';
//        handlerInput.responseBuilder.addElicitSlotDirective("槽位名称",currentIntent);
//        handlerInput.responseBuilder.addConfirmSlotDirective("槽位名称",currentIntent);
//        handlerInput.responseBuilder.addDelegateDirective(currentIntent);
//        handlerInput.responseBuilder.addConfirmIntentDirective(currentIntent);
        return handlerInput.responseBuilder
            .addDelegateDirective(currentIntent)
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

/**
 Azero系统根据您自定义意图的意图标识自动生成此函数。
 canhandle:判断传入此意图的请求是否要被此函数处理。默认判断规则为：请求中的意图标识与本意图标识匹配，且用户与技能一次对话交互已经完成(即DialogState为COMPLETED)。
 handle:当canhandle返回为true时,自动执行。开发者需在handle内部编写此意图的业务逻辑代码。
 用户与技能对话交互过程(DialogState)，有三种状态:STARTED、IN_PROGRESS、COMPLETED。若意图不涉及多轮对话即可只关注COMPLETED状态。
 若完成当前意图后希望转到新意图withShouldEndSession需设为false，且需返回Dialog的Directive。
 */
const  CompletedDelegateHandler_test = {
    canHandle(handlerInput) {
        return azero.getIntentConfirm(handlerInput,'CombineDialogDelegate')
            && azero.getDialogState(handlerInput)==='COMPLETED';
    },
    handle(handlerInput) {
        let currentIntent = handlerInput.requestEnvelope.request.intent;
        let speakOutput = '欢迎使用技能,您可根据当前意图和槽位返回您想回复的话术';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};


/**
 * 用户取消和退出或者错误退出时的Handle
 * @type {{canHandle(*): *, handle(*): *}}
 */
const SessionEndedHandler={
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .withShouldEndSession(true)
            .getResponse();
    }
}

const IntentRequestHandler = {
    canHandle(handlerInput) {
        return azero.getIntentRequest(handlerInput);
    },
    async handle(handlerInput) {
        let speakOutput = "欢迎使用技能";
        //日志组件
        log.info('进入默认处理方法中...',handlerInput.requestEnvelope);
        /**
         * 属性持久化组件
         * 必须初始化persistenceAdapter
         * 必须设置数据库url和数据库名(环境变量或者start.js里面设置)
         * 每个方法需async & await结合使用
         */
        const persistenceAdapterResult = await persistenceAdapter.saveAttributes(handlerInput.requestEnvelope,handlerInput).then(msg=>{
            return msg;
        });
        log.info('属性持久化组件...保存数据方法返回值'+persistenceAdapterResult,handlerInput.requestEnvelope);
        const persistenceAdapterResult1 =await persistenceAdapter.getAttributes(handlerInput.requestEnvelope).then(msg=>{
            return msg;
        })
        log.info('属性持久化组件...查询数据方法返回值'+persistenceAdapterResult1,handlerInput.requestEnvelope);
        const persistenceAdapterResult2 =await persistenceAdapter.deleteAttributes(handlerInput.requestEnvelope).then(msg=>{
            return msg;
        })
        log.info('属性持久化组件...删除数据方法返回值'+persistenceAdapterResult2,handlerInput.requestEnvelope);

        const template = azero.getDefaultTemplateData({
            token:'token',
            backgroundImage:{
                sources:[
                    {url:"http://ssds.background_image_sources.com"}
                ]
            },
            title:{
                mainTitle:'主标题',
                subTitle:'副标题'
            },
            textField:'文本内容',
            extContent:{
                data: '自定义数据',
                type:'领域',
                TTSText:'tts文本内容',
                ASRText:'ASR结果'
            }
        })
        return handlerInput.responseBuilder
            .addRenderTemplateDirective(template)
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/**
 * 所有请求走之前都会执行addRequestInterceptors
 *所有意图函数都需要添加到addRequestHandler中。保证Azero系统能正常将用户的意图请求传入
 *对应的意图函数进行处理。服务部署一般会自动生成添加代码。
 */
exports.handler = azero_sdk.SkillBuilders.custom()
    .addRequestInterceptors(RequestInterceptor)
    .addRequestHandlers(
        CompletedDelegateHandler_test,
        CombineDialogDelegateHandler_test,
        //IntentRequestHandler, 需要持久化可以参考
        SessionEndedHandler
    ).lambda();
