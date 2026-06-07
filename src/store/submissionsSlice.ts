import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FormSubmission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
  country: string;
  terms: boolean;
  image: string;
  submittedAt: number;
}

interface SubmissionsState {
  items: FormSubmission[];
}

const initialState: SubmissionsState = {
  items: [],
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: (
      state,
      action: PayloadAction<Omit<FormSubmission, 'id' | 'submittedAt'>>
    ) => {
      state.items.push({
        ...action.payload,
        id: crypto.randomUUID(),
        submittedAt: Date.now(),
      });
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
