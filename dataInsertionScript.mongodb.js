// Connect to MongoDB
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('bus_app');
    const routesCollection = database.collection('routes');

    // Sample route data
    const route = {
      "route_id": "route_101",
      "route_name": "Abh - chd",
      "bus_id": "bus_202",
      "bus_name": "jujhar Travels",
      "bus_capacity": 75,
      "stops": [
        {
          "stop_id": "stop_1",
          "stop_name": "Abohar",
          "stop_type": "start",
          "arrival_time": null,
          "departure_time": "22:10"
        },
        {
          "stop_id": "stop_2",
          "stop_name": "Malot",
          "stop_type": "intermediate",
          "arrival_time": "22:46",
          "departure_time": "22:50"
        },
        {
          "stop_id": "stop_3",
          "stop_name": "Bathinda",
          "stop_type": "intermediate",
          "arrival_time": "23:37",
          "departure_time": "23:45"
        },
        {
          "stop_id": "stop_4",
          "stop_name": "Barnala",
          "stop_type": "intermediate",
          "arrival_time": "00:50",
          "departure_time": "1:00"
        },
        {
          "stop_id": "stop_5",
          "stop_name": "Sangrur",
          "stop_type": "intermediate",
          "arrival_time": "01:47",
          "departure_time": "1:52"
        },
        {
          "stop_id": "stop_6",
          "stop_name": "Patiala",
          "stop_type": "intermediate",
          "arrival_time": "2:40",
          "departure_time": "3:00",
        },
        {
          "stop_id": "stop_7",
          "stop_name": "Rajpura",
          "stop_type": "intermediate",
          "arrival_time": "3:20",
          "departure_time": "3:25",
        },
        {
          "stop_id": "stop_8",
          "stop_name": "Zirakpur",
          "stop_type": "intermediate",
          "arrival_time": "4:15",
          "departure_time": "4:20",
        },
        {
          "stop_id": "stop_9",
          "stop_name": "Chandigarh",
          "stop_type": "intermediate",
          "arrival_time": "4:50",
          "departure_time": null,
        },
      ],
      "days_of_operation": ["Sun","Mon", "Tue", "Wed", "Thu", "Fri","Sat"]
    };

    // Insert the sample data
    await routesCollection.insertOne(route);

    console.log('Sample data inserted successfully.');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
