# KeyFunder

Tools for importing and exporting BSV on the MetaNet

A live deployment of the master branch of this repository is at [keyfunder.babbage.systems](https://keyfunder.babbage.systems)

## Features (in development)

  - Import BSV into a MetaNet Client
    - From a WIF private key
    - From a Ninja private key
    - From Money Button
    - From HandCash
    - From another MetaNet user
  - Send BSV out of a MetaNet Client
    - To a Ninja private key
    - To another MetaNet user
    - To a Bitcoin SV Address (NOT RECOMMENDED)

## Development Instructions

Clone the repo, then run `npm i` to install packages.

To start the live development server on `localhost:3000`, run `npm run start`.

Your browser should automatically open, and your changes should be reflected on-screen whenever you reload.

## License

The license for the code in this repository is the Open BSV License.



## October2026 build runtime maintenance

Build qualification uses patched Node22.23.4 and the frozen historical lock;
`--legacy-peer-deps` retains the original npm6 peer-resolution contract.
Application dependency versions and public client compatibility are unchanged.
The obsolete Cloud Run workflow is retained only as a non-executable reference
at `docs/legacy-cloud-run-deploy.yaml.txt`; this update does not restore a legacy
service or publish a browser bundle.
