import React from 'react';
import CustomTable from '../../../components/tables/table';
import ArrowDown from '../../../../assets/arrow-down.png';
import sellOrdersVal from '../sellOrders';

const SellOrders = ({currentCurrency}) => (
    <div className={'card-block primary form-group-app p-0'}>
        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
            <p>Orderbook</p>
            <div className={'form-title-actions'}>
                <button className={'btn btn-transparent pl-0 btn-disabled'}>
                    <img src={ArrowDown} alt="Sell Arrow"/> SELL ORDERS
                </button>
            </div>
        </div>
        <CustomTable
            header={[
                {
                    name: `Price ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: false
                },{
                    name: `Amount ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: false
                },{
                    name: `Total ${currentCurrency.currency.toUpperCase()}`,
                    alignRight: true
                }
            ]}
            className={'mb-3 pt-0 no-min-height no-padding'}
            tableData={sellOrdersVal}
            emptyMessage={'No account properties found .'}
            TableRowComponent={(props) => (
                <tr className={''}>
                    <td className={'red-text'}>{props.price}</td>
                    <td>{props.amount}</td>
                    <td className={'align-right'}>{props.total}</td>
                </tr>
            )}
        />
    </div>
);

export default SellOrders;