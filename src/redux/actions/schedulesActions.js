// Acción para establecer los horarios generados
export const setSchedules = (schedules) => {
    return {
      type: "SET_SCHEDULES",
      payload: schedules,
    };
  };
  