import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classroomId: "",
  messages: [],
};

export const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    addClassroom: (state, action) => {
      state.classroomId = action.payload.classroomId;
      state.messages = action.payload.messages;
    },
    removeClassroom: (state) => {
      state.classroomId = "";
      state.messages = [];
    },
  },
});

export const { addClassroom, removeClassroom } = classroomSlice.actions;

export default classroomSlice.reducer;
