import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user";
import classroomSlice from "./features/classroom";

export const store = configureStore({
  reducer: {
    user: userSlice,
    classroom: classroomSlice,
  },
});
