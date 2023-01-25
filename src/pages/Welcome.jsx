import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import ImportIcon from '@material-ui/icons/Input'
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
      <Typography className={classes.title_text} variant='h1' paragraph>KeyFunder</Typography>
      <Link type='button' to='/import' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <ImportIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Import</Typography>
              <Typography color='textSecondary'>Move BSV into your MetaNet client</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/send' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <SendIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Send</Typography>
              <Typography color='textSecondary'>Move BSV out of your MetaNet client</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
    </center>
  )
}

export default Welcome
