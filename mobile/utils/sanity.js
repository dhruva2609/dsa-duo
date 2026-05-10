import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: '9xrhs2r3', // <-- Paste your ID from the studio here
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-04-24',
});

// Function to fetch questions based on user choice
export const fetchQuestions = async (language, level) => {
    try {
        const query = `*[_type == "question" && language == "${language}" && level == ${level}]`;
        const data = await client.fetch(query);
        return data;
    } catch (error) {
        console.error("Sanity Fetch Error:", error);
        return [];
    }
};