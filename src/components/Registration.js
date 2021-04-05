import React from 'react';
import { connect } from 'react-redux'
import store from '../store/store';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

import { CreateActionSetLogin, CreateActionPassword } from '../actions/actions'

class Registration extends React.Component {

    URL = "http://localhost:3001";

    state = {
        message: "",
        current: [],
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



    async register(event) {
        event.preventDefault();

        const email = store.getState().login;
        const password = store.getState().password;

        const reader = new FileReader();

        console.log(this.state.current)
        var uint8Array = null;

        reader.readAsArrayBuffer(this.state.current[0] ? this.state.current[0] : new Blob([]));

        reader.onloadend = () => {
            console.log(reader.result)
            uint8Array = new Uint8Array(reader.result);
            console.log(uint8Array)

            this.setState({ loading: true });

            fetch(`${this.URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, mas: [...uint8Array] }),
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
                    else this.setState({ message: data.message });
                })
                .catch(err => {
                    alert(err);
                    console.log("Not Found");
                });

        };


    }

    render() {

        return (
            <form style={{ width: "500px", margin: "auto" }}>
                <h2 class="text-white">Sign up</h2>
                <div className="form-group">
                    <label class="text-white" htmlFor="email">Email address</label>
                    <input className="form-control" onChange={(event) => this.setLogin(event)} id="email" type="email" name="email" placeholder="name@example.com" />
                </div>
                <div className="form-group">
                    <label class="text-white" htmlFor="password">Password</label>
                    <input className="form-control" onChange={(event) => this.setPassword(event)} id="password" type="password" name="password" placeholder="••••••••" />
                </div>
                {!this.state.message ? null : <span style={{ color: "#D81313", fontSize: "12px" }}>{this.state.message}</span>}
                <div className='btnnav'>
                    <nav className="navbar navbar-light ">
                        <form className="container-fluid justify-content-end">
                        <input
                            className="btn btn-outline-dark"
                            onChange={(event) => this.setImage(event)}
                            accept="image/*"
                            type="file"
                        />
                         <span className="navbar-text">
                         {this.state.loading ? 'Retention...' : null}
                        </span>
                        <NavLink to="/" className="btn btn-outline-dark"  onClick={(event) => this.register(event)}>Sign up</NavLink>
                        </form>
                    </nav>
                </div>
            </form>

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