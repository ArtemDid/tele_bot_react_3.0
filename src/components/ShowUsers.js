import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import './style.css';


const App = () => {
    const URL = "http://localhost:3001/users";

    var [source, setSource] = useState([]);
    var [searchTerm, setSearchTerm] = useState("");
    var [imgLoad, setImg] = useState(false);

    const users = () => {
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
                    console.log(data.response.rows);
                    setSource(data.response.rows);
                }
            })
            .catch(err => {
                console.log(err.message);
                let error = new Error("Not Found");
                error.httpError = 404;
                throw error;
            });
    }

    useEffect(() => {
        users();
    }, [])

    const editSearchTerm = (e) => {
        setSearchTerm(e.target.value);
        console.log(dynamicSearch());
    }

    const dynamicSearch = () => {
        return source.filter(name => name.login.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    const handleImageLoaded = () => {
        setImg(true)
    }

    const renderCurrency = dynamicSearch().map((item, index) => {
        return (
            <tr key={index}>
                <th scope="row"> {index + 1} </th>
                <td> {item.login} </td>
                <td>
                    <img src={item.path ? item.path : 'https://via.placeholder.com/150'} className="round" onLoad={(e) => handleImageLoaded(e)}></img>
                    <div class="spinner-border text-primary" role="status" hidden={imgLoad}></div>
                </td>
            </tr>
        )
    });


    return (
        <div className="container-fluid" >
            <nav className="navbar navbar-light">
                <form className="container-fluid justify-content-end">
                    <input type="search" aria-label="Search" value={searchTerm} onChange={(e) => editSearchTerm(e)} placeholder='Search for a login! &#128269;' />
                    <NavLink to="/showpage" className="btn btn-dark" activeClassName="active">Back</NavLink>
                </form>
            </nav>
            <br></br>
            <h3 class="text-white">These are the important names:</h3>
            <div className='container'>
                <table className="table mt-5 text-center table-dark">
                    <thead >
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col"> login </th>
                            <th scope="col"> ava </th>
                        </tr>
                    </thead>
                    <tbody >
                        {renderCurrency}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;