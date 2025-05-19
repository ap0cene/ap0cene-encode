/* eslint-disable */
import { ec as EC } from 'elliptic'
import shajs from 'sha.js'

export interface HaloQueryParams {
  pk2?: string
  rnd?: string
  rndsig?: string
  av?: string
  v?: string
  flags?: string
  pk1?: string
  cmd?: string
  res?: string
}

const ecInstance = new EC('secp256k1')

// Method is described in docs here: https://docs.arx.org/HaLo/non-interactive
export function verifyHaloChipSignature(params: HaloQueryParams) {
  const { pk2, rnd, rndsig } = params

  if (!pk2 || !rnd || !rndsig) {
    throw new Error('Missing required parameters (pk2, rnd, rndsig) for verification.')
  }

  const rndBuf = Buffer.from(rnd, 'hex')

  if (rndBuf.length !== 32) {
    throw new Error('Incorrect length of the rnd parameter or hex decoding failure.')
  }

  const msgHashed = shajs('sha256')
    // static prefix: b'\x19Attest counter pk2:\n'.hex()
    // @ts-ignore
    .update(Buffer.concat([Buffer.from([0x19]), Buffer.from('Attest counter pk2:\n', 'utf8')]))
    .update(rndBuf)
    .digest('hex')

  const sigBuf = Buffer.from(rndsig, 'hex')

  if (sigBuf.length < 2 || 2 + sigBuf[1] > sigBuf.length) {
    throw new Error('Malformed signature in the rndsig field.')
  }

  const cutSig = sigBuf.subarray(0, 2 + sigBuf[1]).toString('hex')

  let key: EC.KeyPair | null = null

  try {
    key = ecInstance.keyFromPublic(pk2, 'hex')
  } catch (e) {
    throw new Error('Unable to decode public key.')
  }

  if (!key) {
    throw new Error('Public key object was not created.')
  }

  const pk2Exported = key.getPublic(/* compact: */ false, 'hex')

  if (key.verify(msgHashed, cutSig)) {
    const counter = rndBuf.readUInt32BE(0)
    return {
      // always returns uncompressed public key
      publicKey2: pk2Exported,
      // the scan counter that was validated
      scanCounter: counter,
    }
  } else {
    throw new Error('Failed to verify signature!')
  }
}
