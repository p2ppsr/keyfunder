import React from 'react'
import Welcome from './pages/Welcome'
import Import from './pages/Import'
import ImportFromWIF from './pages/ImportFromWIF'
import ImportFromMoneyButton from './pages/ImportFromMoneyButton'
import Send from './pages/Send'
import SendToNinja from './pages/SendToNinja'
import SendToAddress from './pages/SendToAddress'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Typography } from '@material-ui/core'

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route path='/import' component={Import} />
          <Route path='/import-from-wif' component={ImportFromWIF} />
          <Route path='/import-from-money-button' component={ImportFromMoneyButton} />
          <Route path='/send' component={Send} />
          <Route path='/send-to-ninja' component={SendToNinja} />
          <Route path='/send-to-address' component={SendToAddress} />
          <Route
            default component={() => (
              <center style={{ marginTop: '2em' }}>
                <Typography align='center' variant='h4' paragraph>
                  This functionality is not yet supported.
                </Typography>
                <Typography>
                  <Link to='/'>Back to Main Menu</Link>
                </Typography>
              </center>
            )}
          />
        </Switch>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
