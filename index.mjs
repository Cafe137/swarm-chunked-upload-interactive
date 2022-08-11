import { Strings } from 'cafe-utility'
import { readFile } from 'fs/promises'
import { uploadChunked } from 'swarm-chunked-upload'

main()

async function main() {
    const { bzzReference, context } = await uploadChunked(await readFile(process.argv[2]), {
        filename: Strings.normalizeFilename(process.argv[2]),
        stamp: process.argv[3],
        beeUrl: 'http://127.0.0.1:1633',
        onSuccessfulChunkUpload: async (chunk, context) => {
            console.log('✅', `${context.beeUrl}/chunks/${toHexString(chunk.address())}`)
        },
        onFailedChunkUpload: async (chunk, context) => {
            console.error('❌', `${context.beeUrl}/chunks/${toHexString(chunk.address())}`)
        }
    })
    console.log('📦', `${context.beeUrl}/bzz/${toHexString(bzzReference)}/`)
}

function toHexString(bytes) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
}
