import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from "react-redux";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

const ShufflingItem = (props) => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.shuffling)}>
                {props.shuffling}
            </a>
        </td>
        <td>{props.stage}</td>
        <td>{props.holdingType}</td>
        <td className="align-right">{props.amount / 100000000}</td>
        <td className="align-right">{props.registrantCount} / {props.participantCount}</td>
        <td className="blue-link-text align-right">
            <a onClick={() => props.setBodyModalParamsAction('INFO_ACCOUNT', props.issuer)}>
                {props.issuerRS}
            </a>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(ShufflingItem)