import React from 'react';
import { connect } from 'react-redux'
import store from '../store/store';
import { NavLink } from 'react-router-dom';
import { SmileOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, DatePicker, TimePicker, Select, Cascader, InputNumber } from 'antd';

import { CreateActionSetLogin, CreateActionPassword } from '../actions/actions'
import './style.css';

const onFinish = (values) => {
   console.log('Received values of form: ', values);
};

class Authorization extends React.Component {
   check = false;
   ls = window.localStorage;
   URL = "http://localhost:3001";
   state = {
      message: null,
      error: null
   }

   setLogin(event) {
      this.props.dispatch(CreateActionSetLogin(event.target.value));
      this.setState({ message: "", error: null });
      if (this.ls.length > 0) this.ls.clear();

   }
   setPassword(event) {
      this.props.dispatch(CreateActionPassword(event.target.value));
      this.setState({ message: "", error: null });

   }

   Mycheck(event) {
      this.check = event.target.checked;
   }

   auth(event) {
      event.preventDefault();

      const email = localStorage.getItem(Object.keys(localStorage)[0]) ? localStorage.getItem(Object.keys(localStorage)[0]) : store.getState().login;
      const password = store.getState().password;

      console.log(email, password)
      fetch(`${this.URL}/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email, password }),
      })
         .then(response => {
            return response.json();
         })
         .then(data => {
            console.log(data);
            if (data.success) {

               if (this.ls !== undefined) {
                  this.ls.setItem("login", email);
                  this.ls.setItem("password", password);
                  this.ls.setItem("token", data.token);
               }
               this.props.history.push('/showpage');
            }
            else this.setState({ message: data.message, error: "error" });


         })
         .catch(err => {
            alert(err);
            console.log("Not Found");
         });
   }

   render() {
      return (
         <Form
            style={{ width: "300px", margin: "auto" }}
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
         >
            <h2>Sign in</h2>
            <Form.Item
               name="username"
               validateStatus={this.state.error}
            >
               <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Login" 
               defaultValue={localStorage.getItem(Object.keys(localStorage)[0])}
               onChange={(event) => this.setLogin(event)}
               />
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
               <Button type="primary" htmlType="submit" className="login-form-button" onClick={(event) => this.auth(event)}> Log in </Button>
               Or <NavLink to="/registration" activeClassName="active">register now!</NavLink>
            </Form.Item>
         </Form>

         // <form style={{ width: "500px", margin: "auto" }}>
         //    <h2 class="text-white">Sign in</h2>
         //    <div className="form-group">
         //       <label class="text-white" htmlFor="email">Email address</label>
         //       <input className="form-control" onChange={(event) => this.setLogin(event)} type="email" id="email" placeholder="name@example.com" defaultValue={localStorage.getItem(Object.keys(localStorage)[0])} />
         //    </div>
         //    <div className="form-group">
         //       <label class="text-white" htmlFor="password">Password</label>
         //       <input className="form-control" onChange={(event) => this.setPassword(event)} type="password" name="password" placeholder="••••••••" />
         //    </div>
         //    {!this.state.message ? null : <span style={{ color: "#D81313", fontSize: "12px" }}>{this.state.message}</span>}
         //    <div className='btnnav'>
         //       <nav className="navbar navbar-light ">
         //          <form className="container-fluid justify-content-end">
         //             <NavLink to="/showpage" className="btn btn-outline-light" activeClassName="active" onClick={(event) => this.auth(event)}>Sign in</NavLink>
         //             <NavLink to="/registration" className="btn btn-outline-light" activeClassName="active">Sign up</NavLink>
         //          </form>
         //       </nav>
         //    </div>
         // </form>



      );
   }
}

const mapStateToProps = function (state) {
   return {
      login: state.login,
      password: state.password
   }
}

export default connect(mapStateToProps)(Authorization);