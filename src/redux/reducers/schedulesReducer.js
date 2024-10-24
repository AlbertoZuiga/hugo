const initialState = {
    data: [],
  };
  
  const schedulesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_SCHEDULES":
        return {
          ...state,
          data: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default schedulesReducer;
  