import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'question',
    title: 'DSA Question',
    type: 'document',
    fields: [
        defineField({ name: 'text', type: 'string', title: 'Question Text' }),
        defineField({
            name: 'language',
            type: 'string',
            options: { list: ['cpp', 'java', 'py', 'js'] }
        }),
        defineField({ name: 'level', type: 'number', title: 'Level' }),
        defineField({ name: 'options', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'correctAnswer', type: 'string' }),
        defineField({ name: 'explanation', type: 'text' }),
    ],
})