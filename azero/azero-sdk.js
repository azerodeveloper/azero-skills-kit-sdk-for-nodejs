var azero_sdk = require('ask-sdk');
exports.sdk = azero_sdk;

/**
 * Retrieves the locale from the request.
 *
 * The method returns the locale value present in the request. More information about the locale can be found
 * here: https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#request-locale
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getLocale(handlerInput) {
    return azero_sdk.getLocale(handlerInput.requestEnvelope);
}
exports.getLocale = getLocale;
/**
 * Retrieves the account linking access token from the request.
 *
 * The method retrieves the user's accessToken from the input request. Once a user successfully enables a skill
 * and links their Alexa account to the skill, the input request will have the user's access token. A null value
 * is returned if there is no access token in the input request. More information on this can be found here:
 * https://developer.amazon.com/docs/account-linking/add-account-linking-logic-custom-skill.html
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getAccountLinkingAccessToken(handlerInput) {
    return azero_sdk.getAccountLinkingAccessToken(handlerInput.requestEnvelope);
}
exports.getAccountLinkingAccessToken = getAccountLinkingAccessToken;
/**
 * Retrieves the API access token from the request.
 *
 * The method retrieves the apiAccessToken from the input request, which has the encapsulated information of
 * permissions granted by the user. This token can be used to call Alexa-specific APIs. More information
 * about this can be found here:
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#system-object
 *
 * The SDK automatically injects this value into service client instances retrieved from the {@link services.ServiceClientFactory}
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getApiAccessToken(handlerInput) {
    return azero_sdk.getApiAccessToken(handlerInput.requestEnvelope);
}
exports.getApiAccessToken = getApiAccessToken;
/**
 * Retrieves the device ID from the request.
 *
 * The method retrieves the deviceId property from the input request. This value uniquely identifies the device
 * and is generally used as input for some Alexa-specific API calls. More information about this can be found here:
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#system-object
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getDeviceId(handlerInput) {
    return azero_sdk.getDeviceId(handlerInput.requestEnvelope);
}
exports.getDeviceId = getDeviceId;
/**
 * Retrieves the user ID from the request.
 *
 * The method retrieves the userId property from the input request. This value uniquely identifies the user
 * and is generally used as input for some Alexa-specific API calls. More information about this can be found here:
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#system-object
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getUserId(handlerInput) {
    return azero_sdk.getUserId(handlerInput.requestEnvelope);
}
exports.getUserId = getUserId;
/**
 * Retrieves the dialog state from the request.
 *
 * The method retrieves the `dialogState` from the intent request, if the skill's interaction model includes a
 * dialog model. This can be used to determine the current status of user conversation and return the appropriate
 * dialog directives if the conversation is not yet complete. More information on dialog management can be found here:
 * https://developer.amazon.com/docs/custom-skills/define-the-dialog-to-collect-and-confirm-required-information.html
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getDialogState(handlerInput) {
    return azero_sdk.getDialogState(handlerInput.requestEnvelope);
}
exports.getDialogState = getDialogState;
/**
 * Returns the {@link Slot} for the given slot name from the request.
 *
 * This method attempts to retrieve the requested {@link Slot} from the incoming request. If the slot does not
 * exist in the request, a null value will be returned.
 *
 * @param {RequestEnvelope} requestEnvelope
 * @param {string} slotName
 * @return {Slot}
 */
function getSlot(handlerInput,slotName) {
    return azero_sdk.getSlot(handlerInput.requestEnvelope,slotName);
}
exports.getSlot = getSlot;
/**
 * Retrieves the {@link SupportedInterfaces} from the request.
 *
 * This method returns an object listing each interface that the device supports. For example, if
 * supportedInterfaces includes AudioPlayer, then you know that the device supports streaming audio using the
 * AudioPlayer interface.
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {SupportedInterfaces}
 */
function getSupportedInterfaces(handlerInput) {
    return azero_sdk.getSupportedInterfaces(handlerInput.requestEnvelope);
}
exports.getSupportedInterfaces = getSupportedInterfaces;
/**
 * Returns whether the request is a new session.
 *
 * The method retrieves the new value from the input request's session, which indicates if it's a new session or
 * not. More information can be found here :
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#session-object
 *
 * @param requestEnvelope
 */
function isNewSession(handlerInput) {
    return azero_sdk.isNewSession(handlerInput.requestEnvelope);
}
exports.isNewSession = isNewSession;
/**
 * Retrieves the type of the request.
 *
 * The method retrieves the request type of the input request. More information about the different request
 * types are mentioned here:
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#request-body-parameters
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getRequestType(handlerInput) {
    return azero_sdk.getRequestType(handlerInput.requestEnvelope);
}
exports.getRequestType = getRequestType;
/**
 * Retrieves the name of the intent from the request.
 *
 * The method retrieves the intent name from the input request, only if the input request is an {@link IntentRequest}.
 *
 * @param {RequestEnvelope} requestEnvelope
 * @return {string}
 */
function getIntentName(handlerInput) {
    return azero_sdk.getIntentName(handlerInput.requestEnvelope);
}
exports.getIntentName = getIntentName;
/**
 * Returns the value from the given {@link Slot} in the request.
 *
 * This method attempts to retrieve the requested {@link Slot}'s value from the incoming request. If the slot does not
 * exist in the request, a null will be returned.
 *
 * @param {RequestEnvelope} requestEnvelope
 * @param {string} slotName
 * @return {string}
 */
function getSlotValue(handlerInput,slotName) {
    return azero_sdk.getSlotValue(handlerInput.requestEnvelope,slotName);
}
exports.getSlotValue = getSlotValue;

function getIntentConfirm(handlerInput,intentName) {
    return getRequestType(handlerInput) === 'IntentRequest'
        && getIntentName(handlerInput) === intentName;
}
exports.getIntentConfirm = getIntentConfirm;

function getIntentRequest(handlerInput) {
    return getRequestType(handlerInput) === 'IntentRequest';
}
exports.getIntentRequest = getIntentRequest;

function responseBuilder(handlerInput){
    return handlerInput.responseBuilder;
}
exports.responseBuilder = responseBuilder;