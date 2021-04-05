import { createStore } from 'redux';

const initialStateToDo = {
    login: "",
    password: ""
}

const reduser = function (state = initialStateToDo, action) {

    switch (action.type) {
        case "ACTION_SET_BUY_LOGIN":
            {
                return { ...state, login: action.payload }
            }
        case "ACTION_SET_PASSWORD":
            {
                return { ...state, password: action.payload }
            }
        default: return state;
    }
}

const store = createStore(reduser);

store.subscribe(function () {
    console.log(store.getState());
});

export default store;