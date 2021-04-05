import React from "react";
import ShowRates from './ShowRates';
import TodayRates from './TodayRates';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import './style.css';

class TodoApp extends React.Component {
    constructor() {
        super();
        this.state = {
            todos: [],
            currentPage: 1,
            todosPerPage: 5,
            upperPageBound: 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 3
        };
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    }

    URL = "https://576031bbc0d2.ngrok.io";
    ls = window.localStorage;

    getTodos = (() => {
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

                    this.setState({ todos: data.rows });
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


    })();


    componentDidUpdate() {

        $("ul li.active").removeClass('active');
        $('ul li#' + this.state.currentPage).addClass('active');
    }
    handleClick(event) {
        let listid = Number(event.target.id);
        this.setState({
            currentPage: listid
        });
        $("ul li.active").removeClass('active');
        $('ul li#' + listid).addClass('active');
        this.setPrevAndNextBtnClass(listid);
    }
    setPrevAndNextBtnClass(listid) {
        let totalPage = Math.ceil(this.state.todos.length / this.state.todosPerPage);
        this.setState({ isNextBtnActive: 'disabled' });
        this.setState({ isPrevBtnActive: 'disabled' });
        if (totalPage === listid && totalPage > 1) {
            this.setState({ isPrevBtnActive: '' });
        } else if (listid === 1 && totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
        } else if (totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
            this.setState({ isPrevBtnActive: '' });
        }
    }
    btnIncrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnDecrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnPrevClick() {
        if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
            this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnNextClick() {
        if ((this.state.currentPage + 1) > this.state.upperPageBound) {
            this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    setCount(event) {
        this.setState({ todosPerPage: event.target.value });
        // localStorage.getItem(Object.keys(localStorage)[1])
    }


    render() {
        const { todos, currentPage, todosPerPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state;
        console.log(todos)

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((todo, index) => {
            return (<tr key={index} >
                <th scope="row"> {todo.id} </th>
                <td> {todo.name} </td>
                <td> {todo.query} </td>
            </tr>)
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            if (number === 1 && currentPage === 1) {
                return (<li key={number}
                    className='page-item active'
                    id={number} >
                    < a href='#'
                        className='btn btn-dark'
                        id={number}
                        onClick={this.handleClick} > {number}
                    </a>
                </li >
                )
            } else if ((number < upperPageBound + 1) && number > lowerPageBound) {
                return (<li key={number}
                    id={number} > < a href='#' className='btn btn-dark' id={number} onClick={this.handleClick} > {number} </a></li >
                )
            }
        });
        let pageIncrementBtn = null;
        if (pageNumbers.length > upperPageBound) {
            pageIncrementBtn = <li> <a href='#' className='btn btn-dark' onClick={this.btnIncrementClick} > &hellip; </a></li >
        }
        let pageDecrementBtn = null;
        if (lowerPageBound >= 1) {
            pageDecrementBtn = <li > < a href='#' className='btn btn-dark' onClick={this.btnDecrementClick} > &hellip; </a></li >
        }
        let renderPrevBtn = null;
        if (isPrevBtnActive === 'disabled') {
            renderPrevBtn = < li className={isPrevBtnActive} > < a href='#' className='btn btn-dark' > < span id="btnPrev" > Prev </span></a > </li>
        } else {
            renderPrevBtn = < li className={isPrevBtnActive} > < a href='#' className='btn btn-dark' id="btnPrev" onClick={this.btnPrevClick} > Prev </a></li >
        }
        let renderNextBtn = null;
        if (isNextBtnActive === 'disabled') {
            renderNextBtn = < li className={isNextBtnActive} > < a href='#' className='btn btn-dark' > < span id="btnNext" > Next </span></a > </li>
        } else {
            renderNextBtn = < li className={isNextBtnActive} > < a href='#' className='btn btn-dark' id="btnNext" onClick={this.btnNextClick} > Next </a></li >
        }

        return (

            <div className="container-fluid" >
                <nav className="navbar navbar-light">
                    <form className="container-fluid justify-content-end">
                        <span className="navbar-text">
                            {localStorage.getItem(Object.keys(localStorage)[0])}
                        </span>
                        <NavLink to="/showusers" className="btn btn-dark" activeClassName="active">Show Users</NavLink>
                        <TodayRates />
                        <ShowRates />
                        < a href='/' className="btn btn-outline-success me-2">Logout</a>
                    </form>
                </nav>
                <div className='container'>
                    <table className="table mt-5 text-center table-dark">
                        <thead>
                            <tr >
                                <th scope="col"> # </th>
                                <th scope="col"> Name </th>
                                <th scope="col"> Query </th>
                            </tr>
                        </thead>
                        <tbody >
                            {renderTodos}
                        </tbody>
                    </table>
                   </div>
                <ul className="pagination justify-content-center" >
                    <input type="number" name="tentacles" min="1" max="10" defaultValue="5" onChange={(event) => this.setCount(event)} />
                    {renderPrevBtn}
                    {pageDecrementBtn}
                    {renderPageNumbers}
                    {pageIncrementBtn}
                    {renderNextBtn}
                </ul>
            </div>
        );
    }
}


export default TodoApp;