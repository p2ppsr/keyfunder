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
import { isAuthenticated, getNetwork, getPublicKey, createAction } from '@babbage/sdk'
import { toast } from 'react-toastify'
import Ninja from 'utxoninja'
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

  const [ninjaLoading, setNinjaLoading] = useState(false)
  const [ninjaAmount, setNinjaAmount] = useState('')
  const [ninjaPrivateKey, setNinjaPrivateKey] = useState('')
  const [ninjaDojoURL, setNinjaDojoURL] = useState('')
  const [ninjaSuccess, setNinjaSuccess] = useState(false)
  const [ninjaSPVData, setNinjaSPVData] = useState('')

  const handleNinjaSend = async () => {
    try {
      setNinjaLoading(true)

      // MetaNet user must be authenticated
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        throw new Error('No MetaNet user is authenticated!')
      }

      // Create a foreign Ninja for processing the new payment
      const foreignNinja = new Ninja({
        privateKey: ninjaPrivateKey,
        config: {
          dojoURL: ninjaDojoURL
        }
      })

      // Foreign Ninja must be on the same network as MetaNet user
      const userNetwork = await getNetwork()
      const ninjaNetwork = await foreignNinja.getNetwork('short')
      if (userNetwork !== ninjaNetwork) {
        throw new Error(`MetaNet user and Ninja are not on the same network! MetaNet user: ${userNetwork}, Ninja: ${ninjaNetwork}`)
      }

      // Create a derivation prefix and suffix to derive the public key
      const derivationPrefix = require('crypto')
        .randomBytes(10)
        .toString('base64')
      const derivationSuffix = require('crypto')
        .randomBytes(10)
        .toString('base64')
      // Derive the public key used for creating the output script
      const derivedPublicKey = await getPublicKey({
        counterparty: bsv.PrivateKey.fromHex(ninjaPrivateKey)
          .publicKey.toString(),
        protocolID: '3241645161d8',
        keyID: `${derivationPrefix} ${derivationSuffix}`
      })

      // Create an output script that can only be unlocked with the corresponding derived private key
      const script = new bsv.Script(
        bsv.Script.fromAddress(bsv.Address.fromPublicKey(
          bsv.PublicKey.fromString(derivedPublicKey)
        ))
      ).toHex()
      // Create a new output to spend
      const outputs = [{
        script,
        satoshis: ninjaAmount
      }]

      // Build a transaction for the foreign Nija
      const transaction = await createAction({
        outputs,
        // TODO: custom description
        description: 'Outgoing payment from KeyFunder to foreign Ninja'
      })

      transaction.outputs = [{
        vout: 0,
        satoshis: ninjaAmount,
        derivationSuffix
      }]

      const directTransaction = {
        derivationPrefix,
        transaction,
        senderIdentityKey: await getPublicKey({ identityKey: true }),
        protocol: '3241645161d8',
        note: 'Incoming payment from KeyFunder'
      }

      setNinjaSPVData(JSON.stringify(directTransaction, null, 2))

      // Process the incoming transaction
      await foreignNinja.submitDirectTransaction(directTransaction)

      setNinjaSuccess(true)
      toast.success('Payment sent! Recipient Ninja has processed transaction.')
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setNinjaLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' align='center' className={classes.title_text}>Send to a Ninja</Typography>
      <Link type='button' to='/send' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <ReplyIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Go Back</Typography>
              <Typography color='textSecondary'>Send money somewhere else</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      {!ninjaSuccess
        ? (
          <>
            <Typography paragraph>
              Enter the Ninja's private key and Dojo URL. Then enter the amount to send.
            </Typography>
            <TextField
              fullWidth
              label='Private Key (hex)'
              value={ninjaPrivateKey}
              onChange={e => setNinjaPrivateKey(e.target.value)}
            />
            <br />
            <br />
            <TextField
              fullWidth
              label='External Dojo URL'
              value={ninjaDojoURL}
              onChange={e => setNinjaDojoURL(e.target.value)}
            />
            <br />
            <br />
            <TextField
              label='Amount (satoshis)'
              type='number'
              fullWidth
              value={ninjaAmount}
              onChange={e => setNinjaAmount(parseInt(e.target.value))}
            />
            <br />
            <br />
            <Button
              disabled={ninjaLoading}
              onClick={handleNinjaSend}
              variant='contained'
              color='primary'
              size='large'
              startIcon={<SendIcon />}
            >
              Send to Ninja
            </Button>
            <br />
            <br />
            {ninjaLoading && <LinearProgress />}
          </>)
        : (
          <>
            <Typography paragraph>
              You sent <b>{ninjaAmount} satoshis</b> to an external Ninja! The money has been received and processed by the recipient.
            </Typography>
            <Typography variant='h4'>SPV Information</Typography>
            <pre className={classes.spv_data_display}>
              {ninjaSPVData}
            </pre>
            <Button
              onClick={() => {
                setNinjaSuccess(false)
                setNinjaAmount('')
                setNinjaSPVData('')
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
