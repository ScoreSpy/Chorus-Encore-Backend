import { Credentials } from 'google-auth-library'
import { google } from 'googleapis'
import { MethodOptions } from 'googleapis-common'
import axios from 'gaxios'
import database from './../database'
import googleCreds from './../../configs/google'
import type { drive_v3 } from 'googleapis/build/src/apis/drive/v3'

export type GoogleCredentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export const Oauth2Client = new google.auth.OAuth2(googleCreds.id, googleCreds.secret, 'http://localhost')
const GoogleDrive = google.drive({ version: 'v3', auth: Oauth2Client })

async function GetCredentials (): Promise<void> {
  const token = (await database.s_variables.findOneBy({ key: 'googleCredentials' })).value
  if (!token) { throw new Error('No GoogleAPI credentials') }

  const googleCredentials: GoogleCredentials = JSON.parse(token)
  Oauth2Client.setCredentials(googleCredentials)
}

export async function SetCredentials (tokens: Credentials): Promise<void> {
  // webhooks.onAutomatedAction('Regenerated GoogleAPI Credentials').catch(console.error)
  Oauth2Client.setCredentials(tokens)

  const res = await database.s_variables.findOneBy({ key: 'googleCredentials' })
  res.value = JSON.stringify(tokens)
  await database.s_variables.save(res)
}

Oauth2Client.on('tokens', async (tokens) => {
  await SetCredentials(tokens)
})

function isCredentialsValid (): boolean {
  if (!Oauth2Client.credentials.expiry_date) { return false }
  if (new Date().getTime() >= Oauth2Client.credentials.expiry_date) { return false }
  return true
}

export default async function CrawlRecursive () {
  if (!isCredentialsValid()) { await GetCredentials() }
}
