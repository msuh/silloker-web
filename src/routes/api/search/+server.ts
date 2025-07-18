import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SECRET_BACKEND_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { searchRecord, page, size } = await request.json();

  const url = new URL(`${SECRET_BACKEND_URL}/records/search`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('size', size.toString());

  // console.log(searchRecord, page, size);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchRecord)
  });

  if (!response.ok)
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);

  const result = await response.json();
  console.log(result);

  return json(result);
};
