import React, { Fragment, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { Modal, Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './style.css';

export const App = () => {
    const URL = "http://localhost:3001";

    const [dataRates, setdataRates] = useState([]);

    const Currency = ['AZN', 'BYN', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'GEL', 'HUF', 'ILS', 'JPY', 'KZT', 'MDL', 'NOK', 'PLZ', 'RUB', 'SEK', 'SGD', 'TMT', 'TRY', 'USD', 'UZS']

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function currency(rate) {
        fetch(`${URL}/rates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rate }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data, rate);
                if (data.success) {
                    console.log(data.mas);
                    setdataRates(data.mas);
                }
            })
            .catch(err => {
                console.log(err.message);
                let error = new Error("Not Found");
                error.httpError = 404;
                throw error;
            });

    }

    const menu = (
        <Menu>
            {Currency.map((item, index) => {
                return (
                    <Menu.Item key={index}>
                        <a href="#" onClick={() => currency(item)}>{item}</a>
                    </Menu.Item>
                )
            })}
        </Menu>
    );

    return (
        <Fragment>
            <a type="primary" onClick={showModal}> Monitoring of courses </a>

            <Modal title="Monitoring of courses" visible={isModalVisible} width='800px' onCancel={handleCancel}
                footer={[
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            Currency <DownOutlined />
                        </a>
                    </Dropdown>,
                    <Button key="Close" onClick={handleCancel} style={{marginLeft: '10px'}}>
                        Close
                </Button>
                ]}
            >
                <div id="container" >
                    <LineChart
                        data={dataRates}
                        height={300}
                        width={600}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="saleRate"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="purchaseRate" stroke="#82ca9d" />
                    </LineChart>

                </div>
            </Modal>
        </Fragment>
    );
};

export default App;