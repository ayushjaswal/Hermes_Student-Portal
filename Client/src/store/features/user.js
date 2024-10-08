import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  enrollment: "",
  ABCId: "",
  DOB: "",
  firstName: "",
  secondName: "",
  subjects: [],
  _id: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.email = action.payload.email;
      state.enrollment = action.payload.enrollment;
      state.ABCId = action.payload.ABCId;
      state.DOB = action.payload.DOB;
      state.firstName = action.payload.firstName;
      state.secondName = action.payload.secondName;
      state._id = action.payload._id;
      state.subjects = action.payload.subjects;
    },
    removeUser: (state) => {
      state.email = "";
      state.enrollment = "";
      state.ABCId = "";
      state.DOB = "";
      state.firstName = "";
      state.secondName = "";
      state._id = "";
      state.subjects = [];
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
