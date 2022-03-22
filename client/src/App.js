import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from '@apollo/client'
import Persons from './courseComponents/Persons'
import PersonForm from './courseComponents/PersonForm'
import { ALL_PERSONS } from './courseComponents/queries'

const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <PersonForm />
    </div>
  );
}

export default App;
