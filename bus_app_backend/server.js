const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017/';

app.get('/api/stops', async (req, res) => {
  const { q } = req.query;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('bus_app');
    const routes = database.collection('routes');

    const stops = await routes.aggregate([
      { $unwind: '$stops' },
      { $match: { 'stops.stop_name': { $regex: q, $options: 'i' } } },
      { $group: { _id: null, stop_names: { $addToSet: '$stops.stop_name' } } },
      { $project: { _id: 0, stop_names: 1 } }
    ]).toArray();

    res.json(stops.length ? stops[0].stop_names : []);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'An error occurred while fetching stops.' });
  } finally {
    await client.close();
  }
});

app.get('/api/routes', async (req, res) => {
  const { start, destination } = req.query;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('bus_app');
    const routes = database.collection('routes');

    const matchingRoutes = await routes.find({
      stops: { $all: [
        { $elemMatch: { stop_name: start } },
        { $elemMatch: { stop_name: destination } }
      ]}
    }).toArray();

    const filteredRoutes = matchingRoutes.filter(route => {
      const startIndex = route.stops.findIndex(stop => stop.stop_name === start);
      const endIndex = route.stops.findIndex(stop => stop.stop_name === destination);
      return startIndex < endIndex;
    });

    res.json(filteredRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'An error occurred while fetching routes.' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
