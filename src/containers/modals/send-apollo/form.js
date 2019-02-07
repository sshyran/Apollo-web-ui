import React from 'react';
import {connect} from 'react-redux';
import {
    setBodyModalParamsAction, 
} from '../../../modules/modals';

import {CheckboxFormInput} from '../../components/form-components/check-button-input';
import CustomInputForm from '../../components/form-components/textual-input';
import CustomTextArea from '../../components/form-components/text-area';
import AccountRSFormInput from '../../components/form-components/account-rs'
import NummericInputForm from '../../components/form-components/numeric-input'

const SendMoneyForm = ({values, setValue, modalData, setBodyModalParamsAction, idGroup}) => (
    <>
        <AccountRSFormInput
            field={'recipient'}
            defaultValue={(modalData && modalData.recipient) ? modalData.recipient : ''}
            label={'Recipient'}
            counterLabel={'APL'}
            placeholder={'Recipient'}
            setValue={setValue}
            idGroup={idGroup}
            id={`${idGroup}recipient-field`}
        />

        <NummericInputForm 
            field={'amountATM'}
            counterLabel={'APL'}
            type={'tel'}
            label={'Amount'}
            setValue={setValue}
            placeholder={'Amount'}
            idGroup={idGroup}
        />
        <CustomInputForm 
            hendler={() => setBodyModalParamsAction('SEND_APOLLO_PRIVATE')}
            label={'Private transaction'}
            id={'open-private-transaction-from-modal'}
            type={'button'}
            idGroup={idGroup}
        />
        <CheckboxFormInput
            setValue={setValue}
            idGroup={idGroup}
            checkboxes={[
                {
                    field: 'add_message',
                    label: 'Add a message?'
                }
            ]}
        />
        {
            values.add_message && 
            <>
                <CustomTextArea 
                    setValue={setValue}
                    label={'Message'}
                    placeholder={'Message'}
                    field="message"
                    idGroup={idGroup}
                />
                <CheckboxFormInput
                    setValue={setValue}
                    idGroup={idGroup}
                    checkboxes={[
                        {
                            field: 'encrypt_message',
                            label: 'Encrypt Message',
                            defaultValue: true
                        }, {
                            field: 'permanent_message',
                            label: 'Message is Never Deleted',
                        }
                    ]}
                />
            </>
        }
    </>
)

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
	setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});


export default connect(mapStateToProps, mapDispatchToProps)(SendMoneyForm);