// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@lib/firebase'
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from 'firebase/firestore/lite'
import { nanoid } from 'nanoid'

type Data = {
    url: string,
    short: string
}

const shrink = async (db: Firestore, url: string) => {
    const short = nanoid(5)
    const data = {
        url: url,
        short: short
    }
    await setDoc(doc(db, 'tiny-nosaka-me', short), data)
    return short
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const body = req.body
    try {
        const short = await shrink(db, body.url)
        res.status(200).json({ "url": body.url, "short": short })
    } catch (e) {
        console.error(e)
        res.status(500)
    }

}
