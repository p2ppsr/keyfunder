import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import ReplyIcon from '@material-ui/icons/Reply'
import InputIcon from '@material-ui/icons/Input'
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
      gridTemplateColumns: '3em 1fr'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '2.5em 1fr'
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
      <Typography className={classes.title_text} variant='h1' paragraph>Import BSV</Typography>
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
      <Link to='/import-from-wif' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <InputIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>WIF Private Key</Typography>
              <Typography color='textSecondary'>Sweep funds from a Wallet Import Format (WIF) key</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/import-from-user' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <InputIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>COMING SOON: Another MetaNet User</Typography>
              <Typography color='textSecondary'>Receive incoming funds sent from another user</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/import-from-ninja' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <InputIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>COMING SOON: Ninja Private Key</Typography>
              <Typography color='textSecondary'>Withdraw from a Ninja private key into your MetaNet Client</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/import-from-money-button' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <InputIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>COMING SOON: Money Button</Typography>
              <Typography color='textSecondary'>Withdraw from your Money Button account into your MetaNet Client</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to='/import-from-handcash' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <InputIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>COMING SOON: HandCash</Typography>
              <Typography color='textSecondary'>Withdraw from HandCash into your MetaNet Client</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Typography color='textSecondary'>
        This software is open-source. Check out the code on <a href='https://github.com/p2ppsr/keyfunder' target='_blank' rel='noreferrer'>GitHub</a>.
      </Typography>
    </center>
  )
}

export default Welcome
