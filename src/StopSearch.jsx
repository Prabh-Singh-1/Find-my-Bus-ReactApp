import React, { useState, useRef } from 'react';
import axios from 'axios';
import './StopSearch.css';

const App = () => {
  const [inputs, setInputs] = useState({ start: '', destination: '' });
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showStops, setShowStops] = useState({});
  const [message, setMessage] = useState('');
  const [isrun, setisRun] = useState({})
  const startInputRef = useRef(null);
  const destInputRef = useRef(null);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));

    if (value) {
      try {
        const response = await axios.get('http://localhost:5000/api/stops', {
          params: { q: value }
        });
        if (name === 'start') {
          setStartSuggestions(response.data);
        } else {
          setDestSuggestions(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      if (name === 'start') {
        setStartSuggestions([]);
      } else {
        setDestSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (name, suggestion) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: suggestion,
    }));
    if (name === 'start') {
      setStartSuggestions([]);
    } else {
      setDestSuggestions([]);
    }
  };

  const handleSwap = () => {
    setInputs(prevInputs => ({
      start: prevInputs.destination,
      destination: prevInputs.start,
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/routes', {
        params: { start: inputs.start, destination: inputs.destination }
      });
      if (response.data.length === 0) {
        setMessage(`No buses available between ${inputs.start} and ${inputs.destination}`); // Set message if no buses found
        setBuses([]);
      } else {
        setMessage(''); // Clear message if buses found
        setBuses(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const toggleShowStops = (routeId) => {
    setShowStops(prevShowStops => ({
      ...prevShowStops,
      [routeId]: !prevShowStops[routeId]
    }));
  };

  const doesBusRunOnDay = (bus, day) => {
    return bus.days_of_operation.includes(day);
  };

  const doesBusRunEveryDay = (busDays) => {
    console.log(days.every(day => busDays.includes(day)))
    return days.every(day => busDays.includes(day));
  };
  



  return (
    <>
      <div className='main-container bg-white flex sm:flex-row flex-col pt-14 pb-8 px-24 m-2 rounded-sm justify-center items-center sm:gap-0px gap-5'>
        <div className='flex sm:flex-row sm:justify-around flex-col justify-center items-center w-full sm:gap-0 gap-3'>
          <div className='input-container'>
            <input
              type="text"
              name="start"
              value={inputs.start}
              onChange={handleInputChange}
              placeholder='From Stop' className='btn-hover inp placeholder-slate-400'
              ref={startInputRef}
            />
            {startSuggestions.length > 0 && (
              <ul className='stop-opt px-3 bg-slate-300 border-solid border-2 border-slate-300'>
                {startSuggestions.map((suggestion, index) => (
                  <li className='my-1 cursor-pointer' key={index} onClick={() => handleSuggestionClick('start', suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <img src="src\assets\swap.svg" alt="swap" onClick={handleSwap} className='w-8 cursor-pointer' />

          <div className='input-container'>
            <input
              type="text"
              name="destination"
              value={inputs.destination}
              onChange={handleInputChange}
              placeholder='To Stop' className='btn-hover inp placeholder-slate-400'
              ref={destInputRef}
            />
            {destSuggestions.length > 0 && (
              <ul className='stop-opt px-3 bg-slate-300 border-solid border-2 border-slate-300'>
                {destSuggestions.map((suggestion, index) => (
                  <li className='my-1 cursor-pointer' key={index} onClick={() => handleSuggestionClick('destination', suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div onClick={handleSearch} className="search flex flex-row justify-around items-center text-white bg-green-600  border-2 border-green-600 border-solid p-4 rounded-lg sm:w-auto cursor-pointer w-full">
          <img src="src\assets\search.svg" alt="search" />
          <span className='sm:hidden block text-base '>
            Find Buses
          </span>
        </div>
      </div>
      <div className='bg-blue-600 text-white text-xl font-medium flex justify-center items-center p-4 gap-12'>
        <div>
          <i className="fas fa-road" style={{ color: 'white' }}></i>
        </div>
        <div>
          {inputs.start} - {inputs.destination}
        </div>
      </div>
      {message && <div className='text-red-500 text-center text-xl p-3 bg-white'>{message}</div>} {/* Display message if set */}

      {buses.length > 0 && buses.map((bus, index) => {
        // Get index of start and destination stops
        const startIndex = bus.stops.findIndex(stop => stop.stop_name === inputs.start);
        const endIndex = bus.stops.findIndex(stop => stop.stop_name === inputs.destination);

        // Only render buses that have both stops and startIndex is less than endIndex
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          const intermediateStops = bus.stops.slice(startIndex + 1, endIndex);

          return (
            <div className='bus-container sm:flex-row flex-col bg-white rounded-2xl' key={index}>
              <div className='bus-data p-3 flex flex-row justify-center items-center sm:gap-5 gap-2'>

                <div>
                  <i className="fas fa-bus-alt"></i>
                </div>

                <div className='time'>
                  {bus.stops[startIndex].departure_time} - {bus.stops[endIndex].arrival_time}
                </div>
                <div className='BusName'>
                  {bus.bus_name}
                </div>
              </div>
              <div className='days-of-operation flex gap-1' >
                {doesBusRunEveryDay(bus.days_of_operation) ?
                  <span style={{ color: 'blue' }}>Runs Daily</span>
                  :
                  days.map(day => (
                    <span key={day} style={{ color: bus.days_of_operation.includes(day) ? 'blue' : 'black' }}>
                      {day}{' '}
                    </span>
                  ))
                }
              </div>
              <div className='IntermediateStops flex flex-col justify-center items-center'>
                <a href="#!" onClick={() => toggleShowStops(bus.route_id)}>
                  see stops
                </a>
                {showStops[bus.route_id] && (
                  <ul>
                    {intermediateStops.length > 0 ? (

                      intermediateStops.map((stop, i) => (
                        <li key={i} className='flex sm:flex-row flex-col justify-center items-center sm:gap-2 gap-1'>
                          <span>
                            {stop.stop_name},
                          </span>
                          <div className='sm:m-auto my-1'>
                            <span className='mx-2'>
                              Arrive: {stop.arrival_time},
                            </span>
                            <span>
                              Depart: {stop.departure_time}
                            </span>
                          </div>
                        </li>
                      ))

                    )
                      :
                      (
                        <span className='text-red-500'> No Intermediate Stops.</span>
                      )}

                  </ul>
                )}
              </div>
            </div>
          );

        }
        { buses.length == 0 && <div>No Bus available on this root</div> }
        return null;

      })}
    </>
  );
};

export default App;
