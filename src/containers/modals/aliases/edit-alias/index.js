/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';

import {getAliasAction} from '../../../../actions/aliases/';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";

import ModalBody from '../../../components/modals/modal-body';
import EditAliasForm from './form';

class EditAlias extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,
            inputType: 'uri',

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        };
    }

    componentDidMount = () => {
        this.getAlias();
    };

    async handleFormSubmit(values) {

        values = {
            ...values,
            aliasName: this.state.alias.aliasName,
        };


        this.props.processForm(values, 'setAlias', 'Alias has been edited!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Alias has been edited!', null, 5000);
        });
    }

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Edit Alias'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Edit Alias'}
            >
                <EditAliasForm />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAlias);
