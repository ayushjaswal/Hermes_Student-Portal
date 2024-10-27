import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  avatar: "",
  DOB: "",
  name: "",
  subjects: [],
  classroom: [],
  _id: "",
};

export const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    addFaculty: (state, action) => {
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.DOB = action.payload.DOB;
      state.name = action.payload.name;
      state._id = action.payload._id;
      state.subjects = action.payload.subjects;
      state.classroom = action.payload.classroom;
    },
    removeFaculty: (state) => {
      state.email = "";
      state.DOB = "";
      state.avatar = "";
      state.name = "";
      state._id = "";
      state.subjects = [];
      state.classroom = [];
    },
  },
});

export const { addFaculty, removeFaculty } = facultySlice.actions;

export default facultySlice.reducer;
