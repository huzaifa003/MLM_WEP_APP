import React, { useState, useEffect } from 'react';
import { getJoin } from '../global';
import { useTheme } from '@mui/material/styles';
import Calendar from 'react-calendar';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectPlan = ({ onSubmit }) => {

  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    url: '',
    address: '',
    description: '',
    meetingDate: '',
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [companyName, setCompanyName] = useState([]);
  const [selected, setSelected] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  useEffect(() => {
    const fetchCompanyNames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/company/getAllCompany');
        const companyNames = response.data.map((name) => name.companyName);
        // Add static company name to the array
        const staticCompanyName = 'Not Mention';
        const modifiedCompanyNames = [staticCompanyName, ...companyNames];
        setCompanyName(modifiedCompanyNames);
      } catch (error) {
        console.error('Error fetching company names:', error);
      }
    };
    fetchCompanyNames();

  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    if ( value === 'Not Mention') {
      setShowAdditionalFields(true); // Show additional fields when "Not Mention" is selected
    } else {
      setShowAdditionalFields(false); // Hide additional fields for other company names
    }
    setSelected(value);
  };
  const formHandling = (event) => {
    const { id, value } = event.target;
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleCalendarChange = (date) => {
    if (availableDates.includes(date)) {
      setAvailableDates(availableDates.filter((d) => d !== date));
    } else {
      setAvailableDates([...availableDates, date]);
    }
  };

  const handleSelectDate = (date) => {
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      meetingDate: date,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(() => {
      axios.post("http://localhost:3000/team/newTeam", { data: companyDetails });
      console.log(companyDetails);
    });
  
  };

  return (
    <div className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto">
      {getJoin() === 'company' && (
        <>
          <div className='text-center'>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <Link to='/login'>Click to Go Login Page</Link>
            </button>
          </div>
        </>
      )}
      {getJoin() === 'team' && (
      <>
        
          <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
            <Select
              displayEmpty
              value={selected}
              onChange={(event) => handleInputChange(event)}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Select Company</em>;
                }
                return selected;
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                <em>Select Company</em>
              </MenuItem>
              {companyName.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {showAdditionalFields && (
            <>
              <label className="block text-gray-700 font-bold mb-2 my-2" htmlFor="companyName">
                Company Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={companyDetails.name}
                onChange={formHandling}
                placeholder="Enter company Name"
              />
              <label className="block text-gray-700 font-bold mb-2 my-2" htmlFor="companyUrl">
                Company URL
              </label>
              <input
                type="text"
                id="url"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={companyDetails.url}
                onChange={formHandling}
                placeholder="Enter company URL"
              />

              <label className="block text-gray-700 font-bold mb-2 my-2" htmlFor="companyAddress">
                Company Address
              </label>
              <input
                type="text"
                id="address"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={companyDetails.address}
                onChange={formHandling}
                placeholder="Enter company Address"
              />

              <label className="block text-gray-700 font-bold mb-2 my-2" htmlFor="companyDescription">
                Company Description
              </label>
              <textarea
                id="description"
                className="border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring focus:border-blue-500"
                rows={6}
                cols={45}
                value={companyDetails.description}
                onChange={formHandling}
                placeholder="Enter your text"
              />

              <label className="block text-gray-700 font-bold mb-2 my-2" htmlFor="teamMeeting">
                Schedule Meeting
              </label>
              <Calendar
                value={companyDetails.meetingDate}
                onClickDay={handleSelectDate}
                tileClassName={({ date, view }) =>
                  view === 'month' && availableDates.includes(date) ? 'available' : null
                }
                onChange={handleCalendarChange}
              />
            </>
          )}
          <div className='text-center'>
            <button onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <Link to='/login'>Submit</Link>
            </button>
          </div>
       </>
      )}
    </div>
  );
};

export default SelectPlan;
