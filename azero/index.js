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
        let slot = azero.getSlotValue(handlerInput,"SlotName");
        let jsonObject = JSON.parse(slot);
        let slotNames = jsonObject.parameters;
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
            .addRenderTemplateDirective()
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
        // SampleRequestInterceptor
    )
    .addResponseInterceptors(
        // SampleResponseInterceptor
    )
    .addErrorHandlers(
        ErrorHandler
    ).lambda();