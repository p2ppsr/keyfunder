import React from 'react'
import ReactDOM from 'react-dom'
import Prompt from '@babbage/react-prompt'
import App from './App'

ReactDOM.render(
  <Prompt
    customPrompt
    appName='KeyFunder'
    author='Peer-to-peer Privacy Systems Research, LLC'
    authorUrl='https://projectbabbage.com'
    description='Tools for importing and exporting BSV on the MetaNet'
  >
    <App />
  </Prompt>,
  document.getElementById('root')
)
