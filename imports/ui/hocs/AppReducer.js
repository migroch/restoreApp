export default (state, action) => {
  switch (action.type) {
    case "REMOVE_PLAN":
      return {
        ...state,
        plans: state.plans.filter(
          plan => plan.id !== action.payload
        )
      };
    case "ADD_PLAN":
      return {
        ...state,
        plans: [...state.plans, action.payload]
      };
    case "EDIT_PLAN":
      const updatedPlan = action.payload;

      const updatedPlans = state.plans.map(plan => {
        if (plan.id === updatedPlan.id) {
          return updatedPlan;
        }
        return plan;
      });

      return {
        ...state,
        plans: updatedPlans
      };
    default:
      return state;
  }
};