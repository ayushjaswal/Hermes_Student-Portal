import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    addSubject: (state, action) => {
      for (const subject of action.payload.subjects) {
        state.push(subject);
      }
    },
    clearSubjects: (state) => {
      return [];
    },
  },
});

export const { addSubject, clearSubjects } = subjectsSlice.actions;

export default subjectsSlice.reducer;
