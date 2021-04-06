import React from 'react';
import { connect } from 'react-redux'
import store from '../store/store';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

import { CreateActionSetLogin, CreateActionPassword } from '../actions/actions'
import { SmileOutlined, UserOutlined, LockOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, DatePicker, TimePicker, Select, Cascader, InputNumber, Upload, message } from 'antd';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Registration extends React.Component {

    URL = "http://localhost:3001";

    state = {
        message: null,
        error: null,
        imageUrl: null,
        loading: false
    }

    setLogin(event) {

        this.props.dispatch(CreateActionSetLogin(event.target.value));
        this.setState({ message: "" });

    }
    setPassword(event) {

        this.props.dispatch(CreateActionPassword(event.target.value));
        this.setState({ message: "" });

    }
    setImage(event) {
        console.log(event.target.files)

        this.setState({ current: event.target.files });

    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };



    async register(event) {
        event.preventDefault();

        const email = store.getState().login;
        const password = store.getState().password;

        console.log(this.state.imageUrl)

        fetch(`${this.URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, mas: this.state.imageUrl }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                this.setState({ loading: false });
                if (data.success) {
                    Swal.fire(
                        'Good job!',
                        'You clicked the button!',
                        'success'
                    )
                    this.props.history.push('/');
                }
                else this.setState({ message: data.message, error: "error" });
            })
            .catch(err => {
                alert(err);
                console.log("Not Found");
            });

    }

    render() {

        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

        return (

            <Form
                style={{ width: "300px", margin: "auto" }}
                name="normal_login"
                initialValues={{ remember: true }}
            >
                <h2>Sign up</h2>
                <Form.Item
                    name="username"
                    validateStatus={this.state.error}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="name@example.com" onChange={(event) => this.setLogin(event)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    validateStatus={this.state.error}
                    help={this.state.message}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        onChange={(event) => this.setPassword(event)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="login-form-button" onClick={(event) => this.register(event)}> Sign up </Button>
               Or <NavLink to="/" activeClassName="active">Sign in</NavLink>
                </Form.Item>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Form>




            // <form style={{ width: "500px", margin: "auto" }}>
            //     <h2 class="text-white">Sign up</h2>
            //     <div className="form-group">
            //         <label class="text-white" htmlFor="email">Email address</label>
            //         <input className="form-control" onChange={(event) => this.setLogin(event)} id="email" type="email" name="email" placeholder="name@example.com" />
            //     </div>
            //     <div className="form-group">
            //         <label class="text-white" htmlFor="password">Password</label>
            //         <input className="form-control" onChange={(event) => this.setPassword(event)} id="password" type="password" name="password" placeholder="••••••••" />
            //     </div>
            //     {!this.state.message ? null : <span style={{ color: "#D81313", fontSize: "12px" }}>{this.state.message}</span>}
            //     <div className='btnnav'>
            //         <nav className="navbar navbar-light ">
            //             <form className="container-fluid justify-content-end">
            //             <input
            //                 className="btn btn-outline-dark"
            //                 onChange={(event) => this.setImage(event)}
            //                 accept="image/*"
            //                 type="file"
            //             />
            //              <span className="navbar-text">
            //              {this.state.loading ? 'Retention...' : null}
            //             </span>
            //             <NavLink to="/" className="btn btn-outline-dark"  onClick={(event) => this.register(event)}>Sign up</NavLink>
            //             </form>
            //         </nav>
            //     </div>
            // </form>

        );
    }
}

const mapStateToProps = function (state) {
    return {
        login: state.login,
        password: state.password,
    }
}

export default connect(mapStateToProps)(Registration);