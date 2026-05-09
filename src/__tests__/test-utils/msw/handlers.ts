import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://example.com/api', () => {
    return HttpResponse.json({ data: [] });
  }),
];
