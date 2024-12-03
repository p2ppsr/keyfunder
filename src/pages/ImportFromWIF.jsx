import React, { useState } from 'react'
import {
  Card, CardContent, Checkbox, Button, Typography, TextField, LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import boomerang from 'boomerang-http'
import bsv from 'babbage-bsv'
import hashwrap from 'hash-wrap'
import { isAuthenticated, getNetwork, createAction } from '@babbage/sdk'
import { Link } from 'react-router-dom'
import ReplyIcon from '@material-ui/icons/Reply'
import SendIcon from '@material-ui/icons/Send'
import { toast } from 'react-toastify'

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
  const [utxos, setUtxos] = useState([])
  const [key, setKey] = useState('')
  const [network, setNetwork] = useState('mainnet')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleGetUtxos = async () => {
    try {
      setLoading(true)
      const add = bsv.Address.fromPrivateKey(bsv.PrivateKey.fromWIF(key))
      const addr = add.toString()
      const network = add.network.name
      setNetwork(network)
      const wocNet = network === 'testnet' ? 'test' : 'main'
      const got = await boomerang(
        'GET',
        `https://api.whatsonchain.com/v1/bsv/${wocNet}/address/${addr}/unspent`
      )
      setUtxos(got.map(x => ({
        txid: x.tx_hash,
        vout: x.tx_pos,
        satoshis: x.value,
        selected: true
      })))
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSweep = async () => {
    try {
      setLoading(true)

      // MetaNet user must be authenticated
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        throw new Error('No MetaNet user is authenticated! Open a MetaNet Client to receive the funds from the WIF key.')
      }

      // WIF key must be on the same network as MetaNet user
      const userNetwork = await getNetwork()
      let addressNetwork = network
      if (addressNetwork === 'livenet') {
        addressNetwork = 'mainnet'
      }
      if (userNetwork !== addressNetwork) {
        throw new Error(`MetaNet user and WIF key are not on the same network! MetaNet user: ${userNetwork}, WIF key: ${addressNetwork}`)
      }

      const selectedUtxos = utxos.filter(x => x.selected)
      console.log('selected', selectedUtxos)
      const inputs = {}
      for (const i in selectedUtxos) {
        const utxo = selectedUtxos[i]
        if (!inputs[utxo.txid]) {
          inputs[utxo.txid] = await hashwrap(utxo.txid, {
            network,
            taalApiKey: network === 'testnet'
              ? 'testnet_ba132cc4d5b2ebde7ed0ee0f6ee3f678'
              : 'mainnet_6c8f8c37afd5c45e09f62d083288a181'
          })
          inputs[utxo.txid].outputsToRedeem = []
        }
        const tx = new bsv.Transaction()
        tx.from(new bsv.Transaction.UnspentOutput({
          txid: utxo.txid,
          outputIndex: utxo.vout,
          script: bsv.Script.fromAddress(bsv.Address.fromPrivateKey(
            bsv.PrivateKey.fromWIF(key)
          )),
          satoshis: utxo.satoshis
        }))
        const sig = bsv.Transaction.Sighash.sign(
          tx,
          bsv.PrivateKey.fromWIF(key),
          bsv.crypto.Signature.SIGHASH_FORKID |
          bsv.crypto.Signature.SIGHASH_NONE |
          bsv.crypto.Signature.SIGHASH_ANYONECANPAY,
          0, // Always 0
          bsv.Script.fromAddress(bsv.Address.fromPrivateKey(
            bsv.PrivateKey.fromWIF(key)
          )),
          new bsv.crypto.BN(utxo.satoshis)
        )
        const unlockingScript = bsv.Script.buildPublicKeyHashIn(
          bsv.PrivateKey.fromWIF(key).publicKey,
          sig,
          sig.nhashtype
        ).toHex()
        inputs[utxo.txid].outputsToRedeem.push({
          index: utxo.vout,
          unlockingScript
        })
      }
      console.log(inputs)
      // Create transaction redeeming selected UTXOs
      const result = await createAction({
        inputs,
        description: 'Sweep from WIF with KeyFunder'
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
      <Typography variant='h1' align='center' className={classes.title_text}>Import from WIF</Typography>
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
            <TextField
              fullWidth
              label='WIF key'
              onChange={e => setKey(e.target.value)}
            />
            <br />
            <br />
            <Button variant='contained' onClick={handleGetUtxos} disabled={loading}>Get UTXOs</Button>
            <br />
            <br />
            <div className={classes.utxos_grid}>
              <Typography><b>Sweep?</b></Typography>
              <Typography><b>txid</b></Typography>
              <Typography><b>vout</b></Typography>
              <Typography><b>amount</b></Typography>
              {utxos.map((x, i) => (
                <React.Fragment key={i}>
                  <Checkbox
                    checked={x.selected}
                    onChange={() => {
                      setUtxos(old => {
                        const n = [...old]
                        n[i].selected = !old[i].selected
                        return n
                      })
                    }}
                  />
                  <Typography>{x.txid}</Typography>
                  <Typography>{x.vout}</Typography>
                  <Typography>{x.satoshis / 100000000} BSV</Typography>
                </React.Fragment>
              ))}
            </div>
            <br />
            <br />
            <Button
              disabled={utxos.length < 1 || utxos.every(x => x.selected === false) || loading} onClick={handleSweep}
              variant='contained'
              color='primary'
              startIcon={<SendIcon />}
            >
              Import to MetaNet Client
            </Button>
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
                setUtxos([])
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
