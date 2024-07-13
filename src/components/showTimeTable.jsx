// src/ShowTimeTable.js

import React, { useState } from 'react';
import './ShowTimeTable.css';

const ShowTimeTable = ({ routes }) => {
  const [showStops, setShowStops] = useState(false);

  return (
    <div className='container'>
      {routes.map((route, index) => (
        <div key={index}>
          <div className='time'>
            <div>Arrival: {route.stops[0].arrival_time || 'N/A'}</div>
            <div>Departure: {route.stops[route.stops.length - 1].departure_time || 'N/A'}</div>
          </div>
          <div className='BusName'>
            <div>{route.bus_name}</div>
          </div>
          <div className='startAndDestination'>
            <div>Start: {route.stops[0].stop_name}</div>
            <div>Destination: {route.stops[route.stops.length - 1].stop_name}</div>
          </div>
          <div className='IntermediateStops'>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setShowStops(!showStops);
            }}>
              {showStops ? 'Hide stops' : 'See stops'}
            </a>
            {showStops && (
              <ul>
                {route.stops.slice(1, -1).map((stop, i) => (
                  <li key={i}>
                    {stop.stop_name} (Arr: {stop.arrival_time}, Dep: {stop.departure_time})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimeTable;
