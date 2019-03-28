import React from 'react';
import CustomTable from '../../../components/tables/table';
import {withRouter} from 'react-router-dom';

const buyOrders = [
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
    {
        price: '0.000011',
        amount: '44971',
        total: '44971'
    },
]

class TradeHistoryEchanger extends React.Component {

    render () {
        return (
            <div className={'card-block card card-medium p-0 h-100'}>
                <div className={'form-group-app p-0'}>
                    <CustomTable
                        tableName={'Open Orders'}
                        header={[
                            {
                                name: 'PRICE (ETH)',
                                alignRight: false
                            },{
                                name: 'AMOUNT (ETH)',
                                alignRight: false
                            },{
                                name: 'TOTAL (ETH)',
                                alignRight: true
                            }
                        ]}
                        className={'pt-0 no-min-height pb-4'}
                        tableData={buyOrders}
                        emptyMessage={'No account propertes found .'}
                        TableRowComponent={(props) => (
                            <tr className={''}>
                                <td>{props.price}</td>
                                <td>{props.amount}</td>
                                <td className={'align-right'}>{props.total}</td>
                            </tr>
                        )}
                        actionButton={{
                            name:'View All',
                            handler: () => this.props.history.push('/transfer-history')
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(TradeHistoryEchanger);