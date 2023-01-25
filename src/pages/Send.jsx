import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import ReplyIcon from '@material-ui/icons/Reply'
import SendIcon from '@material-ui/icons/Send'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  content_wrap: {
    maxWidth: '1440px',
    margin: 'auto',
    marginTop: '3em',
    boxSizing: 'border-box',
    padding: '2em',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0.5em',
      padding: '0.5em'
    }
  },
  title_text: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2em'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.6em'
    }
  },
  card_link: {
    textDecoration: 'none !important'
  },
  card_container: {
    margin: '1.5em auto'
  },
  card_grid: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '3em 1fr',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '2.5em 1fr',
    }
  },
  link_text: {
    textAlign: 'left'
  }
}), { name: 'Welcome' })

const Welcome = ({ history }) => {
  const classes = useStyles()

  return (
    <center className={classes.content_wrap}>
      <Typography className={classes.title_text} variant='h1' paragraph>Send BSV</Typography>
      <Link type='button' to='/' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <ReplyIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Go Back</Typography>
              <Typography color='textSecondary'>Return to the main menu</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/send-to-ninja' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <SendIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Ninja Private Key</Typography>
              <Typography color='textSecondary'>Move BSV to a Ninja private key</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/send-to-user' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <SendIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Another MetaNet User</Typography>
              <Typography color='textSecondary'>The recipient will need to approve the request</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/send-to-address' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <SendIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>BSV Address</Typography>
              <Typography color='textSecondary'>Send funds to a legacy BSV address <b style={{ color: 'red' }}>(not recommended)</b></Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Typography color='textSecondary'>
        This software is open-source. Check out the code on <a href='https://github.com/p2ppsr/keyfunder' target='_blank'>GitHub</a>.
      </Typography>
    </center>
  )
}

export default Welcome
