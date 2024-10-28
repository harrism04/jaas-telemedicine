import jwt from 'jsonwebtoken'

interface JaaSJWTPayload {
  aud: string;
  iss: string;
  sub: string;
  room: string;
  exp: number;
  nbf: number;
  iat: number;
  context: {
    user: {
      moderator: boolean;
      name: string;
      email: string;
      avatar?: string;
      'hidden-from-recorder'?: boolean;
      id?: string;
    };
    features: {
      recording: boolean;
      livestreaming: boolean;
      transcription: boolean;
      'outbound-call': boolean;
      'sip-outbound-call': boolean;
    };
  };
}

export const generateJWT = (): string => {
  const APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID
  const PRIVATE_KEY = process.env.JAAS_PRIVATE_KEY

  if (!APP_ID || !PRIVATE_KEY) {
    throw new Error('Missing JaaS credentials')
  }

  try {
    const now = Math.floor(Date.now() / 1000)
    
    const payload: JaaSJWTPayload = {
      aud: 'jitsi',
      iss: 'chat',
      sub: APP_ID,
      room: '*',
      exp: now + 7200,
      nbf: now - 5,
      iat: now,
      context: {
        user: {
          moderator: true,
          name: 'Doctor',
          email: 'doctor@example.com',
          'hidden-from-recorder': false,
        },
        features: {
          recording: false,
          livestreaming: false,
          transcription: false,
          'outbound-call': false,
          'sip-outbound-call': false
        }
      }
    }

    // Try using the raw private key without formatting
    return jwt.sign(payload, PRIVATE_KEY, { 
      algorithm: 'RS256'
    })
  } catch (error) {
    console.error('JWT signing error:', error)
    // Return a dummy token for testing
    return 'dummy_token'
  }
}
