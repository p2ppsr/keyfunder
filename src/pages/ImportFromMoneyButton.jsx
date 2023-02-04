import React, { useState, lazy, Suspense } from 'react'
import {
  Card, CardContent, Checkbox, Button, Typography, TextField, LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import boomerang from 'boomerang-http'
import bsv from 'babbage-bsv'
import hashwrap from 'hash-wrap'
import { isAuthenticated, getNetwork, getPublicKey, submitDirectTransaction } from '@babbage/sdk'
import { Link } from 'react-router-dom'
import ReplyIcon from '@material-ui/icons/Reply'
import SendIcon from '@material-ui/icons/Send'
import { toast } from 'react-toastify'
const MoneyButton = lazy(() => import('@moneybutton/react-money-button'))

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
  utxos_grid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gridGap: theme.spacing(2)
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
}), { name: 'Import' })

const Sweep = () => {
  const classes = useStyles()
  const [amount, setAmount] = useState('1000')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [derivationPrefix, setDerivationPrefix] = useState('')
  const [derivationSuffix, setDerivationSuffix] = useState('')

  const handleSetup = async () => {
    try {
      setLoading(true)
      // MetaNet user must be authenticated
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        throw new Error('No MetaNet user is authenticated! Open a MetaNet Client to receive the funds from the WIF key.')
      }

      // WIF key must be on the same network as MetaNet user
      const userNetwork = await getNetwork()
      if (userNetwork !== 'main') {
        throw new Error('Only mainnet MetaNet clients can import from Money Button')
      }
      
      // Create a derivation prefix and suffix to derive the public key
      const derivationPrefix = require('crypto')
        .randomBytes(10)
        .toString('base64')
      setDerivationPrefix(derivationPrefix)
      const derivationSuffix = require('crypto')
        .randomBytes(10)
        .toString('base64')
      setDerivationSuffix(derivationSuffix)
      // Derive the public key used for creating the output script
      const derivedPublicKey = await getPublicKey({
        counterparty: 'anyone',
        forSelf: true,
        protocolID: '3241645161d8',
        keyID: `${derivationPrefix} ${derivationSuffix}`
      })
      setAmount(String(Number(amount)))

      // Create an output script that can only be unlocked with the corresponding derived private key
      setAddress(bsv.Address.fromPublicKey(
          bsv.PublicKey.fromString(derivedPublicKey)
      ).toString())
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (payment) => {
    try {
      setLoading(true)

      console.log(payment)
      const { txid } = payment
      const envelope = await hashwrap(txid)
      envelope.outputs = [
        {
          vout: 0,
          satoshis: Number(amount),
          derivationSuffix: derivationSuffix
        }
      ]
      console.log(envelope)

      // Submit payment to user
      const result = await submitDirectTransaction({
        transaction: envelope,
        derivationPrefix,
        senderIdentityKey: bsv.PublicKey.fromPrivateKey(bsv.PrivateKey.fromHex('0000000000000000000000000000000000000000000000000000000000000001')).toString(),
        protocol: '3241645161d8',
        note: 'Importing BSV from Money Button'
      })
      console.log(result)
      toast.success('WIF Import Successful!')
      setSuccess(true)
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <Typography variant='h1' align='center' className={classes.title_text}>Import from Money Button</Typography>
      <Link type='button' to='/import' className={classes.card_link}>
        <Card elevation={3} className={classes.card_container}>
          <CardContent className={classes.card_grid}>
            <ReplyIcon color='primary' />
            <div className={classes.link_text}>
              <Typography variant='h5'>Go Back</Typography>
              <Typography color='textSecondary'>Import BSV from somewhere else</Typography>
            </div>
          </CardContent>
        </Card>
      </Link>
      {!success
        ? (
          <>
            {!address && (
              <>
                <TextField
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  label='Amount (satoshis)'
                />
                <Button onClick={handleSetup}>Create Money Button</Button>
              </>
            )}
            {address && (
            <Suspense fallback={<div />}>
              <MoneyButton
                to={address}
                onPayment={handlePayment}
                amount={amount / 100000000}
                currency='BSV'
              />
              <Button disabled={loading} onClick={() => {
                setAddress('')
              }}>Cancel</Button>
            </Suspense>
            )}
            <br />
            <br />
            {loading && <LinearProgress />}
          </>
          )
        : (
          <>
            <Typography paragraph>
              The coins have been successfully imported!
            </Typography>
            <Button
              variant='contained' onClick={() => {
                setSuccess(false)
                setAmount([])
              }}
            >
              Done
            </Button>
          </>
          )}
    </div>
  )
}

export default Sweep
