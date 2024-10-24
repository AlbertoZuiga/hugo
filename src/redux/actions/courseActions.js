export const ADD_COURSE = 'ADD_COURSE';
export const REMOVE_COURSE = 'REMOVE_COURSE';

// Acción para agregar un curso
export const addCourse = (course) => ({
  type: ADD_COURSE,
  payload: course,
});

// Acción para eliminar un curso
export const removeCourse = (courseUrl) => ({
  type: REMOVE_COURSE,
  payload: courseUrl,
});
