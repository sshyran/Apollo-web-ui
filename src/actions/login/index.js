import  axios from "axios/index";
import config from "../../config";
import crypto from "../../helpers/crypto/crypto";
import {NotificationManager} from 'react-notifications';

import {INIT_TRANSACTION_TYPES} from '../../helpers/transaction-types/transaction-types';
import {login, loadConstants, startLoad, endLoad, LOAD_BLOCKCHAIN_STATUS, SET_PASSPHRASE} from '../../modules/account';
import { writeToLocalStorage, readFromLocalStorage, deleteFromLocalStorage } from "../localStorage";
import {getTransactionsAction} from "../transactions";
import {updateStoreNotifications} from "../../modules/account";
import submitForm from "../../helpers/forms/forms";
import store from '../../store'

export function getAccountDataAction(requestParams) {
    return async dispatch => {
        const loginStatus = (await makeLoginReq(dispatch, requestParams));

        if (loginStatus.errorCode && !loginStatus.account) {
            NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
        } else {
            document.location = '/dashboard';
        }
    };
}

export function getAccountDataBySecretPhrasseAction(requestParams) {
    return async dispatch => {

        const accountRS = await (dispatch(crypto.getAccountIdAsync(requestParams.secretPhrase)));
        
        dispatch({
            type: 'SET_PASSPHRASE',
            payload: requestParams.secretPhrase
        });

        localStorage.setItem('secretPhrase', JSON.stringify(requestParams.secretPhrase));

        const loginStatus = await makeLoginReq(dispatch, {account: dispatch(accountRS)});

        if (loginStatus) {
            if (loginStatus.errorCode && !loginStatus.account) {
                NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
            } else {
                document.location = '/dashboard';
            }
        }
    };
}



export function isLoggedIn() {
    return dispatch => {
        let account = JSON.parse(readFromLocalStorage('APLUserRS'));

        if (account) {
            makeLoginReq(dispatch, {
                account: account
            });
        } else {
            if (document.location.pathname !== '/login')
                document.location.href = '/login';
        }
    };
}

function makeLoginReq(dispatch, requestParams) {
    dispatch(startLoad());
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            includeAssets: true,
            includeCurrencies: true,
            includeLessors: true,
            includeEffectiveBalance: true,
            ...requestParams
        }
    })
        .then((res) => {
            if (res.data.account) {
                dispatch(endLoad());
                writeToLocalStorage('APLUserRS', res.data.accountRS);
                dispatch(updateNotifications())(res.data.accountRS);
                dispatch(getForging());
                dispatch({
                    type: 'SET_PASSPHRASE',
                    payload: JSON.parse(localStorage.getItem('secretPhrase'))
                });

                dispatch(login(res.data));

                return res.data;
            } else {
                return res.data;
            }
        })
        .catch(function(err){
            NotificationManager.error('Can not connect to server', 'Error', 900000);
        });
}

export function getForging() {
    return (dispatch, getState) => {
        const account = getState().account;

        const passpPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || account.passPhrase;

        dispatch({
            type: 'SET_PASSPHRASE',
            payload: passpPhrase
        });

        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getForging',
                secretPhrase: passpPhrase
            }
        })
            .then((res) => {
                dispatch({
                    type: 'GET_FORGING',
                    payload: res.data
                })
            })
    }
}

export function setForging(requestType) {
    return (dispatch, getState) => {
        const account = getState().account;
        const passpPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || account.passPhrase;
        // dispatch({
        //     type: 'SET_PASSPHRASE',
        //     payload: passpPhrase
        // });
        requestType = {
            ...requestType,
            secretPhrase: passpPhrase
        };


        return dispatch(submitForm.submitForm(null, null, requestType));
    }
}

export function logOutAction(action) {
    switch (action) {
        case('simpleLogOut'):
            localStorage.removeItem("APLUserRS");
            document.location = '/';
            return;
        case('logOutStopForging'):
            store.dispatch(setForging({requestType: 'stopForging'}))
            .done(() => {
                    localStorage.removeItem("APLUserRS");
                    document.location = '/';
                });

            return;
        case('logoutClearUserData'):
            localStorage.clear();
            document.location = '/';
            return;
    }

}

export function getConstantsAction() {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getConstants',
            }
        })
            .then(async (res) => {
                if (!res.data.errorCode) {
                    await dispatch(loadConstants(res.data));
                    await dispatch(loadBlockchainStatus());
                } else {
                }
            })
            .catch(function(err){
                console.log(err)
            });
    };
}

export function loadBlockchainStatus() {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainStatus'
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    dispatch({
                        type: "LOAD_BLOCKCHAIN_STATUS",
                        payload: res.data
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getTime () {
    return dispatch => {
        return axios.get(config.api.serverUrl,{
            params: {
                requestType: 'getTime'
            }
        })
            .then((res) => {
                return res.data
            })
    }
}

export function updateNotifications () {
    return (dispatch, getState) => {
        return async (account) => {

            const time = await dispatch(getTime());

            var fromTS = Math.max(time.time - 60 * 60 * 24 * 14, 0);
            if (account) {
                const transactions = await dispatch(getTransactionsAction({
                    "account": account,
                    "timestamp": fromTS,
                    "firstIndex": 0,
                    "lastIndex": 99
                }));

                let notifications = INIT_TRANSACTION_TYPES;

                let tsDict = {};
                if (transactions) {
                    Object.values(notifications).map(function(typeDict, typeIndex) {
                        typeDict["notificationCount"] = 0;
                        Object.values(typeDict["subTypes"]).map(function(subTypeDict, subTypeIndex) {
                            var tsKey = "ts_" + String(typeIndex) + "_" + String(subTypeIndex);
                            if (tsDict[tsKey]) {
                                subTypeDict["notificationTS"] = tsDict[tsKey];
                            } else {
                                subTypeDict["notificationTS"] = time;
                            }
                            subTypeDict["notificationCount"] = 0;
                        });
                    });

                    if (transactions.transactions && transactions.transactions.length) {
                        for (var i=0; i<transactions.transactions.length; i++) {
                            var t = transactions.transactions[i];
                            var subTypeDict = notifications[t.type];
                            if (subTypeDict) {
                                subTypeDict = subTypeDict["subTypes"][t.subtype];
                                if (t.recipientRS && t.recipientRS === account && subTypeDict["receiverPage"]) {
                                    if (!subTypeDict["lastKnownTransaction"] || subTypeDict["lastKnownTransaction"].timestamp < t.timestamp) {
                                        subTypeDict["lastKnownTransaction"] = t;
                                    }

                                    if (t.timestamp < subTypeDict["notificationTS"].time) {
                                        notifications[t.type]["notificationCount"] += 1;
                                        subTypeDict["notificationCount"] += 1;
                                    }
                                }
                            }
                        }
                    }
                }

                dispatch(updateStoreNotifications(notifications))
            }
        }
    }
}

