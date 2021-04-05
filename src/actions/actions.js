const CreateActionSetLogin = function (login) {
    return {
      type: "ACTION_SET_BUY_LOGIN",
      payload: login
    }
  }
  
  const CreateActionPassword = function (password) {
    return {
      type: "ACTION_SET_PASSWORD",
      payload: password
    }
  }
  
  const CreateActionRepeadPassword = function (repeatpassword) {
    return {
      type: "ACTION_SET_REPEADPASSWORD",
      payload: repeatpassword
    }
  }
  
  const CreateActionData = function (data) {
    return {
      type: "ACTION_SET_DATA",
      payload: data
    }
  }
  
  export { CreateActionSetLogin, CreateActionPassword, CreateActionRepeadPassword, CreateActionData };