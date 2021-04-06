import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Table, Input, Button, Space, Avatar, Image } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import './style.css';
const { Header, Content, Sider } = Layout;

class App extends React.Component {
    URL = "http://localhost:3001/users";
    ls = window.localStorage;

    state = {
        data: [],
        totalPage: 0,
        current: 1,
        minIndex: 0,
        maxIndex: 0,
        pageSize: 5,
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        fetch(`${this.URL}`, {
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
                    console.log(data.response);
                    console.log('good')

                    this.setState({
                        data: data.response.rows,
                        totalPage: data.response.rows.length / this.state.pageSize,
                        minIndex: 0,
                        maxIndex: this.state.pageSize
                    })
                }
                else {
                    let error = new Error("Not Found");
                    error.httpError = 404;
                    throw error;
                }

            })
            .catch(err => {
                alert(err);
                console.log("Not Found");
            });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    setCount(value) {
        console.log(value)

        this.setState({
            pageSize: value
        });
    }
    render() {
        const columns = [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
                align: 'center',
                ...this.getColumnSearchProps('id'),
            },
            {
                title: 'Login',
                dataIndex: 'login',
                key: 'login',
                width: '30%',
                align: 'center',
                ...this.getColumnSearchProps('login'),
            },
            {
                title: 'Ava',
                dataIndex: 'path',
                key: 'path',
                align: 'center',
                render: path => (
                    <Avatar
                        src={<Image src={path ? path : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} />}
                    />
                ),
            },
        ];

        return (

            <div className="App" >
                <Layout>
                    <Header className="header">
                        <Menu theme="dark" mode="horizontal" style={{ textAlign: 'end' }}>
                            <Menu.Item key="1">
                                <NavLink to="/showpage" activeClassName="active">Back</NavLink>
                            </Menu.Item>
                        </Menu>
                    </Header>
                </Layout>

                <div className='container'>
                    <Table columns={columns} dataSource={this.state.data} />
                </div>
            </div>
        );
    }
};

export default App;