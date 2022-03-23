import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ALL_PERSONS } from './courseComponents/queries'
import { useQuery } from '@apollo/client'
import Persons from './courseComponents/Persons'
import PersonForm from './courseComponents/PersonForm'
import Notify from './courseComponents/Notify'
import PhoneForm from './courseComponents/PhoneForm'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  );
}

export default App;
