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
import './style.css';

export const App = () => {
    const URL = "https://576031bbc0d2.ngrok.io";

    const [dataRates, setdataRates] = useState([]);
    const [rate, setCurrencyRates] = useState('');

    const Currency = ['AZN', 'BYN', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'GEL', 'HUF', 'ILS', 'JPY', 'KZT', 'MDL', 'NOK', 'PLZ', 'RUB', 'SEK', 'SGD', 'TMT', 'TRY', 'USD', 'UZS']

    function currency(rate) {
        setCurrencyRates(rate);
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

    const renderCurrency = Currency.map((item, index) => {
        return (
            <li key={index}><a class="dropdown-item" href="#" onClick={() => currency(item)}>{item}</a></li>
        )
    });

    return (
        <Fragment>
            <a className="btn btn-dark" data-toggle="modal" data-target="#largeModal">Monitoring of courses </a>

            <div id="largeModal" className="modal fade" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Monitoring of courses of {rate}</h4>
                            <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div className="modal-body">
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
                        </div>
                        <nav class="navbar ">
                            <form className="container-fluid justify-content-end">
                                <div className="dropdown">
                                    <button type="button" className="btn btn-default dropdown-toggle " data-toggle="dropdown" id="dropdownMenuButton2"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="sr-only">Currency</span>
                                    </button>
                                    <ul className="dropdown-menu scrollable dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                        {renderCurrency}
                                    </ul>
                                </div>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </form>
                        </nav>

                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default App;