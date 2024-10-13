import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: []
};

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    addSubject: (state, action) => {
      state.subjects = action.payload.subjects;
    },
    clearSubjects: () => {
      return [];
    },
  },
});

export const { addSubject, clearSubjects } = subjectsSlice.actions;

export default subjectsSlice.reducer;
