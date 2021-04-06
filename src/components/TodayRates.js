import React, { Fragment, useState, useEffect } from "react";
import { Modal, Button, Table } from 'antd';
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


            {/* <a data-toggle="modal" data-target="#largeModal2">Course for today </a>

            <div id="largeModal2" className="modal fade" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Monitoring of course for today</h4>
                            <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div  >
                                <table className="table table-hover table-dark text-center" >
                                    <thead >
                                        <tr>
                                            <th scope="col"> baseCurrency </th>
                                            <th scope="col"> currency </th>
                                            <th scope="col"> saleRate </th>
                                            <th scope="col"> purchaseRate </th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {renderCurrency}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>

            </div> */}

        </Fragment>
    );
};

export default App;