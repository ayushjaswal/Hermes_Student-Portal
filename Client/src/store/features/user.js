import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  enrollment: "",
  avatar: "",
  ABCId: "",
  DOB: "",
  name:"",
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
      state.avatar = action.payload.avatar;
      state.DOB = action.payload.DOB;
      state.name = action.payload.name;
      state._id = action.payload._id;
      state.subjects = action.payload.subjects;
    },
    removeUser: (state) => {
      state.email = "";
      state.enrollment = "";
      state.ABCId = "";
      state.DOB = "";
      state.avatar = "";
      state.name = "";
      state._id = "";
      state.subjects = [];
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
