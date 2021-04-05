import React from "react";
import { Layout, Menu, Breadcrumb, Table, Input, Button, Space } from "antd";
import "antd/dist/antd.css";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import ShowRates from './ShowRates';
import TodayRates from './TodayRates';
import { NavLink } from 'react-router-dom';
import './style.css';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {
    URL = "http://localhost:3001/";
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
        const email = localStorage.getItem(Object.keys(localStorage)[0]);
        const password = localStorage.getItem(Object.keys(localStorage)[2]);

        console.log(email, password)
        fetch(`${this.URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem(Object.keys(localStorage)[1])
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data);
                    console.log('good')

                    this.setState({
                        data: data.rows,
                        totalPage: data.rows.length / this.state.pageSize,
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
            record[dataIndex]? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                align: 'center',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Query',
                dataIndex: 'query',
                key: 'query',
                align: 'center',
                ...this.getColumnSearchProps('query'),
            },
        ];

        return (
            <div className="App" >
                <Layout>
                    <Header className="header">
                        <Menu theme="dark" mode="horizontal" style={{ textAlign: 'end' }}>
                            <span className="navbar-text">
                                {localStorage.getItem(Object.keys(localStorage)[0])}
                            </span>
                            <Menu.Item key="1">
                                <NavLink to="/showusers" activeClassName="active">Show Users</NavLink>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <TodayRates />
                            </Menu.Item>
                            <Menu.Item key="3">
                                <ShowRates />
                            </Menu.Item>
                            <Menu.Item key="4">
                                <a href="/">Logout</a>
                                {/* <NavLink to="/" activeClassName="active">Logout</NavLink> */}
                            </Menu.Item>
                        </Menu>
                    </Header>
                </Layout>

                <div className='container'>
                    <Table columns={columns} dataSource={this.state.data} position="bottomCenter" />
                </div>

                {/* <InputNumber min={1} max={10} defaultValue={5} onChange={(value) => this.setCount(value)} /> */}

            </div>
        );
    }
}
export default App;