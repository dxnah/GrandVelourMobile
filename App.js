import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { supabase } from './supabase'

export default function App() {

  const [message, setMessage] =
    useState('Connecting...')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {

    const { data, error } =
      await supabase
        .from('auth_user')
        .select('*')

    console.log('DATA:', data)
    console.log('ERROR:', error)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage(
        'Connected to Supabase!'
      )
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{message}</Text>
    </View>
  )
}