import React, { useState } from 'react'
import {
  Button,
  Typography,
  LinearProgress,
  TextField,
  Card,
  CardContent
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import bsv from 'babbage-bsv'
import { isAuthenticated, getNetwork, createAction } from '@babbage/sdk'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import ReplyIcon from '@material-ui/icons/Reply'
import SendIcon from '@material-ui/icons/Send'

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
  },
  spv_data_display: {
    overflow: 'scroll',
    width: '100%',
    maxHeight: '40vh',
    userSelect: 'all',
    boxSizing: 'border-box',
    border: '1px solid #999',
    padding: '0.5em'
  }
}), { name: 'Send' })

const Send = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [success, setSuccess] = useState(false)
  const [SPVData, setSPVData] = useState('')
  const [txid, setTxid] = useState('')

  const handleSend = async () => {
    try {
      setLoading(true)

      // MetaNet user must be authenticated
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        throw new Error('No MetaNet user is authenticated!')
      }

      // Foreign Ninja must be on the same network as MetaNet user
      const userNetwork = await getNetwork()
      const bsvAddress = bsv.Address.fromString(address)
      let addressNetwork = bsvAddress.network.name
      if (addressNetwork === 'livenet') {
        addressNetwork = 'mainnet'
      }
      if (`${userNetwork}` !== addressNetwork) {
        throw new Error(`MetaNet user and Bitcoin SV address are not on the same network! MetaNet user: ${userNetwork}net, Address: ${addressNetwork}`)
      }

      const script = new bsv.Script(
        bsv.Script.fromAddress(bsvAddress)
      ).toHex()
      // Create a new output to spend
      const outputs = [{
        script,
        satoshis: amount
      }]

      // Build a transaction for the address
      const transaction = await createAction({
        outputs,
        // TODO: custom description
        description: 'Outgoing payment from KeyFunder to legacy BSV address'
      })
      setTxid(transaction.txid)

      transaction.outputs = [{
        vout: 0,
        satoshis: amount
      }]

      const directTransaction = {
        transaction,
        note: 'Incoming payment from KeyFunder'
      }

      setSPVData(JSON.stringify(directTransaction, null, 2))

      setSuccess(true)
      toast.success('Payment sent to legacy BSV address :/')
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' align='center' className={classes.title_text}>Send to Legacy BSV Address</Typography>
      <Link type='button' to='/send' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <ReplyIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Go Back</Typography>
              <Typography color='textSecondary'>Prey God, PLEASE send money somewhere else</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      {!success
        ? (
          <>
            <Typography paragraph>
              Legacy BSV addresses are fundamentally unscalable and bad. There is no SPV data exchanged, and this is not a peer-to-peer transaction. It is supported for compatibility reasons only. <b style={{ color: 'red' }}>Avoid legacy BSV addresses WHENEVER POSSIBLE!</b>
            </Typography>
            <TextField
              fullWidth
              label='Legacy BSV Address 🤮'
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <br />
            <br />
            <TextField
              label='Amount (satoshis)'
              type='number'
              fullWidth
              value={amount}
              onChange={e => setAmount(parseInt(e.target.value))}
            />
            <br />
            <br />
            <Button
              disabled={loading}
              onClick={handleSend}
              variant='contained'
              color='primary'
              size='large'
              startIcon={<SendIcon />}
            >
              😬 Send to Address
            </Button>
            <br />
            <br />
            {loading && <LinearProgress />}
          </>)
        : (
          <>
            <Typography paragraph>
              You sent <b>{amount} satoshis</b> to a legacy BSV address (<b>{address}</b>), and we're not sure if the money has been received or processed by the recipient. But that's just how it goes with legacy BSV addresses 🙃
            </Typography>
            <Typography paragraph>
              <b>TXID: </b> {txid}
            </Typography>
            <Typography variant='h4'>SPV Information (in case you wanted it)</Typography>
            <pre className={classes.spv_data_display}>
              {SPVData}
            </pre>
            <Button
              onClick={() => {
                setSuccess(false)
                setAmount('')
                setSPVData('')
                setTxid('')
              }}
              variant='contained'
            >
              Done
            </Button>
          </>
          )}
    </div>
  )
}

export default Send
