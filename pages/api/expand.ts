// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@lib/firebase'
import { collection, doc, Firestore, getDoc, getDocs } from 'firebase/firestore/lite'

type Data = {
  url: string
}

const expand = async (db: Firestore, short: string) => {
  const ref = doc(db, 'tiny-nosaka-me', short)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    throw new Error("No such url")
  }
  return snap.data()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body
  try {
    const data = await expand(db, body.short)
    const url = data!['url']

    res.status(200).json({ "url": url })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

}
