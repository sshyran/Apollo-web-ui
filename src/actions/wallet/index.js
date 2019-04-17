/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import {NotificationManager} from "react-notifications";
import config from '../../config';
import {writeToLocalStorage} from "../localStorage";
import {setWallets} from "../../modules/account";
import {setBuyOrdersAction, setSellOrdersAction, setMyOrdersAction} from "../../modules/exchange";
import {handleFetch, GET, POST} from "../../helpers/fetch";
import {currencyTypes} from "../../helpers/format";

export function getWallets(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/keyStore/accountInfo`, POST, requestParams)
            .then(async (res) => {
                if (!res.errorCode) {
                    dispatch(setWallets(res.currencies));
                    writeToLocalStorage('wallets', JSON.stringify(res.currencies));
                    return res;
                }
            })
            .catch(() => {

            })
    }
}

export function getCurrencyBalance(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/dex/balance`, GET, requestParams)
            .then((res) => {
                if (!res.errorCode) {
                    return res;
                }
            })
            .catch(() => {

            })
    }
}

export function walletWidthraw(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/dex/widthraw`, POST, requestParams)
            .then(async (res) => {
                if (!res.errorCode) {
                    return res;
                }
            })
            .catch(() => {

            })
    }
}

export function createOffer(requestParams) {
    const params = {
        ...requestParams,
        amountOfTime: 300,
        // deadline: 1440,
        feeATM: 200000000,
    };
    console.log('-------params-----', params)
    // return dispatch => {
    //     return handleFetch(`${config.api.server}/rest/dex/offer`, POST, params)
    //         .then(async (res) => {
    //             if (!res.errorCode) {
    //                 NotificationManager.success('Your offer has been created!', null, 5000);
    //                 setTimeout(() => {
    //                     dispatch(getBuyOpenOffers());
    //                     dispatch(getSellOpenOffers());
    //                     dispatch(getMyOpenOffers());
    //                 }, 10000);
    //                 return res;
    //             } else {
    //                 NotificationManager.error(res.errorDescription, 'Error', 5000);
    //             }
    //         })
    //         .catch(() => {
    //
    //         })
    // }
}

export function getOpenOrders(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/dex/offers`, GET, requestParams)
            .then(async (res) => {
                if (!res.errorCode) {
                    return res;
                } else {
                    NotificationManager.error(res.errorDescription, 'Error', 5000);
                }
            })
            .catch(() => {

            })
    }
}

export const getBuyOpenOffers = (currency) => async (dispatch, getState) => {
    if (!currency) currency = getState().exchange.currentCurrency.currency;
    const params = {
        orderType: 0,
        offerCurrency: currencyTypes[currency],
        pairCurrency: 0,
        isAvailableForNow: true,
    };
    const buyOrders = await dispatch(getOpenOrders(params));
    dispatch(setBuyOrdersAction(currency, buyOrders));
};

export const getSellOpenOffers = (currency) => async (dispatch, getState) => {
    if (!currency) currency = getState().exchange.currentCurrency.currency;
    const params = {
        orderType: 1,
        offerCurrency: currencyTypes[currency],
        pairCurrency: 0,
        isAvailableForNow: true,
    };
    const sellOrders = await dispatch(getOpenOrders(params));
    dispatch(setSellOrdersAction(currency, sellOrders));
};

export const getMyOpenOffers = (currency) => async (dispatch, getState) => {
    if (!currency) currency = getState().exchange.currentCurrency.currency;
    const {account} = getState().account;
    const params = {
        offerCurrency: currencyTypes[currency],
        pairCurrency: 0,
        accountId: account,
        isAvailableForNow: true,
    };
    const sellOrders = await dispatch(getOpenOrders(params));
    dispatch(setMyOrdersAction(currency, sellOrders));
};
