import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  plans: [
    {
      id: null,
      title: "",
      scenario: "",
      platItemIds: []
    }
  ]
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function removePlan(id) {
    dispatch({
      type: "REMOVE_Plan",
      payload: id
    });
  }

  function addPlan(Plans) {
    dispatch({
      type: "ADD_Plan",
      payload: Plans
    });
  }

  function editPlan(Plans) {
    dispatch({
      type: "EDIT_Plan",
      payload: Plans
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        Plans: state.Plans,
        removePlan,
        addPlan,
        editPlan
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};