import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user";
import subjectSlice from "./features/subjects";

export const store = configureStore({
  reducer: {
    user: userSlice,
    subjects: subjectSlice,
  },
});
