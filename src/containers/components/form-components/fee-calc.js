import React from 'react';
import InputForm from '../input-form';
import {NotificationManager} from 'react-notifications';
import {connect} from 'react-redux';

import {calculateFeeAction} from "../../../actions/forms";

class FeeCalc extends React.Component {

    calculateFee = async () => {
        const {setValue, values, requestType} = this.props;

        delete values.secretPhrase;
        delete values.passphrase;

        const requestParams = {
            ...values,
            requestType: requestType,
            deadline: '1440',
            publicKey: this.props.publicKey,
            feeATM: 0,
            calculateFee: true,
        };
        
        const fee = await calculateFeeAction(requestParams, requestType);

        if (!fee.errorCode) {
            setValue("feeATM", fee.transactionJSON.feeATM / 100000000);
        } else {
            NotificationManager.error(fee.errorDescription, 'Error', 5000);
        }
    };
    
    render () {
        const {setValue} = this.props;

        return (
            <div className="form-group row form-group-white mb-15">
                <label className="col-sm-3 col-form-label">
                    Fee
                    <span
                        onClick={() => this.calculateFee()}
                        className="calculate-fee"
                    >
                    Calculate
                </span>
                </label>
                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                    <InputForm
                        field="feeATM"
                        placeholder="Minimum fee"
                        type={"float"}
                        setValue={setValue}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">
                            Apollo
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
})

export default connect(mapStateToProps)(FeeCalc)