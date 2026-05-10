import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '9xrhs2r3',
  dataset: 'production',
  useCdn: false, // Set to true for production if you have high traffic
  apiVersion: '2023-05-03', // Use today's date or latest
});
