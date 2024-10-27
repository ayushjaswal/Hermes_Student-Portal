import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user";
import classroomSlice from "./features/classroom";
import facultySlice from "./features/faculty";

export const store = configureStore({
  reducer: {
    user: userSlice,
    classroom: classroomSlice,
    faculty: facultySlice,
  },
});
