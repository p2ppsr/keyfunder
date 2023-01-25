import React from 'react'
import Welcome from './pages/Welcome'
import Import from './pages/Import'
import Send from './pages/Send'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route path='/import' component={Import} />
          <Route path='/send' component={Send} />
        </Switch>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
