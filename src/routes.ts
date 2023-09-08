import Router from 'koa-router';
import axios from 'axios';
import db from './database';

const router = new Router();

// Define API routes for collections
router.post('/collections', async (ctx) => {
	const { name } = ctx.request.body;
	if (!name) {
		ctx.status = 400;
		ctx.body = { message: 'Name is required for a collection.' };
		return;
	}

	const { lastID } = await db.run('INSERT INTO collections (name) VALUES (?)', [name]);
	ctx.body = { id: lastID, name };
});

router.get('/collections', async (ctx) => {
	const collections = await db.all('SELECT * FROM collections');
	ctx.body = collections;
});

// Define API route for fetching Hacker News stories
router.get('/stories', async (ctx) => {
	try {
		const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
		const storyIds = response.data.slice(0, 10); // Fetch the top 10 stories

		const stories = await Promise.all(
			storyIds.map(async (id: number) => {
				const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
				return storyResponse.data;
			})
		);

		ctx.body = stories;
	} catch (error) {
		console.error('Error fetching Hacker News stories:', error);
		ctx.status = 500;
		ctx.body = { message: 'Error fetching Hacker News stories.' };
	}
});

export default router;