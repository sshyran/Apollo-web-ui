import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getMyVotesAction, getVoteAction} from '../../../actions/pools';
import PoolItem from '../active-pools/pool-item';
import uuid from "uuid";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {Link} from 'react-router-dom';

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getMyVotesAction: (reqParams) => dispatch(getMyVotesAction(reqParams)),
    getTransactionAction:     (requestParams) => dispatch(getTransactionAction(requestParams)),
    getVoteAction:     (requestParams) => dispatch(getVoteAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


class MyVotes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstIndex: 0,
            lastIndex: 14,
            page: 1,
            myVotes: null
        };

        this.getMyVotes   = this.getMyVotes.bind(this);
        this.getVote   = this.getVote.bind(this);
    }

    componentDidMount() {
        this.getMyVotes({
            account: this.props.account,
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    componentWillReceiveProps(newState) {
        this.getMyVotes({
            account: this.props.account,
            firstIndex: 0,
            lastIndex:  9,
        });
    }

    async getMyVotes(reqParams){
        const myVotes = await this.props.getMyVotesAction(reqParams);

        if (myVotes && myVotes.transactions) {

            let polls = Promise.all(myVotes.transactions.map(async (el, index) => {
                return await this.getVote({
                    poll: el.attachment.poll,
                });
            }))
                .then((data) => {
                    this.setState({
                        ...this.props,
                        myVotes: data
                    });
                })
        }
    }

    async getVote(reqParams){
        const poll = await this.props.getVoteAction(reqParams);

        if (poll) {
            return poll
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    }



    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My Votes'}
                />
                <div className="page-body container-fluid">
                    <div className="active-pools white-space">
                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Sender</td>
                                        <td>Start date</td>
                                        <td>Blocks left</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody  key={uuid()}>
                                    {
                                        this.state.myVotes &&
                                        this.state.myVotes.map((el, index) => {
                                            return (
                                                <PoolItem
                                                    {...el}
                                                    activePools
                                                    getTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyVotes);