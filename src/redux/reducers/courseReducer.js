// src/redux/reducers/courseReducer.js

const initialState = {
  selectedCourses: JSON.parse(localStorage.getItem('selectedCourses')) || [], // Recuperar los cursos desde el localStorage
};

export default function courseReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_COURSE':
      const updatedCoursesAdd = [...state.selectedCourses, action.payload];
      localStorage.setItem('selectedCourses', JSON.stringify(updatedCoursesAdd)); // Guardar los cursos en localStorage
      return {
        ...state,
        selectedCourses: updatedCoursesAdd,
      };

    case 'REMOVE_COURSE':
      const updatedCoursesRemove = state.selectedCourses.filter(course => course.id !== action.payload.id);
      localStorage.setItem('selectedCourses', JSON.stringify(updatedCoursesRemove)); // Guardar los cursos en localStorage
      return {
        ...state,
        selectedCourses: updatedCoursesRemove,
      };

    default:
      return state;
  }
}
