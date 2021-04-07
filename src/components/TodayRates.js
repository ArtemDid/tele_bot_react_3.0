import React, { Fragment, useState, useEffect } from "react";
import { Modal, Table } from 'antd';
import './style.css';

const App = () => {
    const URL = "http://localhost:3001/rates/today";

    const [dataRates, setdataRates] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function rates() {
        fetch(`${URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data.itemUSD);
                    data.itemUSD.shift();
                    setdataRates(data.itemUSD);
                }
            })
            .catch(err => {
                console.log(err.message);
                let error = new Error("Not Found");
                error.httpError = 404;
                throw error;
            });

    }

    const columns = [
        {
            title: 'BaseCurrency',
            dataIndex: 'baseCurrency',
            align: 'center',
            key: 'baseCurrency',
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            align: 'center',
            key: 'currency',
        },
        {
            title: 'SaleRate',
            dataIndex: 'saleRateNB',
            align: 'center',
            key: 'saleRateNB',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.saleRateNB - b.saleRateNB,
        },
        {
            title: 'PurchaseRate',
            dataIndex: 'purchaseRateNB',
            align: 'center',
            key: 'purchaseRateNB',
        },
    ];

    useEffect(() => {
        rates();
    }, [])

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    const renderCurrency = dataRates.map((item, index) => {
        return (
            <tr key={index} >
                <td > {item.baseCurrency} </td>
                <td > {item.currency} </td>
                <td > {item.saleRate ? item.saleRate : item.saleRateNB} </td>
                <td > {item.purchaseRate ? item.purchaseRate : item.purchaseRateNB} </td>
            </tr>
        )
    });

    return (
        <Fragment>
            <a type="primary" onClick={showModal}> Course for today </a>

            <Modal title="Monitoring of course for today" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table columns={columns} dataSource={dataRates} onChange={onChange} />

            </Modal>

        </Fragment>
    );
};

export default App;