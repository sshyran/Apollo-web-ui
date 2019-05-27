/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, {Component} from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {getCurrencyTypes} from '../../../../modules/currencies';

class MyCurrencytemItem extends Component {
    render () {
        const {code, type, name, unconfirmedUnits, decimals, setBodyModalParamsAction, currency} = this.props;
        const currencyTypes = getCurrencyTypes(type, true);
        const isClaimable = currencyTypes.includes('Claimable');

        return (
            <tr key={uuid()}>
                <td>{code}</td>
                <td>{name}</td>
                <td className="align-right">{(unconfirmedUnits / Math.pow(10, decimals)).toFixed(2)}</td>
                <td className="align-right">
                    <div className="btn-box inline">
                        <Link to={"/exchange-booth/" + code} className="btn btn-green">Exchange</Link>
                        <a
                            onClick={() => setBodyModalParamsAction('TRANSFER_CURRENCY', {code})}
                            style={{marginLeft: 15}}
                            className="btn btn-green"
                        >
                            Transfer
                        </a>
                        <a
                            onClick={() => setBodyModalParamsAction('OFFER_CURRENCY', {code})}
                            className="btn btn-green"
                        >
                            Offer
                        </a>
                        {
                            isClaimable && 
                            <a
                                onClick={() => setBodyModalParamsAction('CLAIM_CURRENCY', currency)}
                                className="btn btn-green"
                            >
                                Claim
                            </a>
                        }
                    </div>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(MyCurrencytemItem);

