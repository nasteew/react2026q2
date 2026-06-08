import { describe, expect, it } from 'vitest';
import reducer, { addSubmission } from './submissionsSlice';

describe('submissionsSlice', () => {
  const submissionData = {
    name: 'Ada',
    age: 25,
    email: 'ada@example.com',
    gender: 'female',
    password: 'Aa1!bbbb',
    confirmPassword: 'Aa1!bbbb',
    country: 'United States',
    terms: true,
    image: 'data:image/png;base64,abc',
  };

  it('adds a submission with generated id and timestamp', () => {
    const state = reducer(undefined, { type: 'init' });
    const nextState = reducer(state, addSubmission(submissionData));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toMatchObject(submissionData);
    expect(nextState.items[0].id).toBeTruthy();
    expect(nextState.items[0].submittedAt).toBeGreaterThan(0);
  });

  it('keeps all submissions in history', () => {
    const first = reducer(undefined, addSubmission(submissionData));
    const second = reducer(
      first,
      addSubmission({
        ...submissionData,
        name: 'Grace',
        email: 'grace@example.com',
      })
    );

    expect(second.items).toHaveLength(2);
    expect(second.items[0].name).toBe('Ada');
    expect(second.items[1].name).toBe('Grace');
  });
});
