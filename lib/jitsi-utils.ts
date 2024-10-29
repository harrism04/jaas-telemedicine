import { KJUR, KEYUTIL, RSAKey } from 'jsrsasign'

interface JaaSJWTPayload {
  aud: string;
  iss: string;
  sub: string;
  room: string;
  exp: number;
  nbf: number;
  context: {
    user: {
      id?: string;
      name: string;
      email: string;
      avatar?: string;
      moderator: boolean;
      'hidden-from-recorder'?: boolean;
    };
    features: {
      livestreaming: boolean;
      recording: boolean;
      transcription: boolean;
      'sip-inbound-call': boolean;
      'sip-outbound-call': boolean;
      'outbound-call': boolean;
      'inbound-call': boolean;
    };
    room?: {
      regex: boolean;
    };
  };
}

const formatPrivateKey = (key: string): string => {
  try {
    console.log('Formatting private key...');
    // First, clean up the key
    let cleanKey = key
      .replace(/\\n/g, '\n')  // Replace literal \n with newlines
      .replace(/"/g, '')      // Remove quotes
      .trim();                // Remove whitespace

    console.log('Key after initial cleanup:', cleanKey.substring(0, 50) + '...');

    // Check if we need to add PEM headers
    if (!cleanKey.includes('-----BEGIN PRIVATE KEY-----')) {
      cleanKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey}\n-----END PRIVATE KEY-----`;
    }

    // Split the key into lines and ensure proper formatting
    const lines = cleanKey.split('\n').filter(line => line.trim() !== '');
    console.log('Number of key lines:', lines.length);
    
    const keyContent = lines
      .filter(line => !line.includes('-----BEGIN') && !line.includes('-----END'))
      .join('');
    
    // Reconstruct the key with proper formatting
    const formattedKey = [
      '-----BEGIN PRIVATE KEY-----',
      ...keyContent.match(/.{1,64}/g) || [],
      '-----END PRIVATE KEY-----'
    ].join('\n');

    console.log('Final key format:', formattedKey.substring(0, 50) + '...');
    return formattedKey;
  } catch (error) {
    console.error('Error formatting private key:', error);
    return key;
  }
};

// Add this function to help debug JWT contents
const decodeJWT = (token: string) => {
  try {
    const [headerB64, payloadB64] = token.split('.');
    const header = JSON.parse(atob(headerB64));
    const payload = JSON.parse(atob(payloadB64));
    
    console.log('Decoded JWT Header:', header);
    console.log('Decoded JWT Payload:', payload);
    
    // Verify required fields
    const requiredFields = ['iss', 'sub', 'aud', 'room', 'context'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required JWT fields:', missingFields);
    }
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error('JWT is expired');
    }
    
    return { header, payload };
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const generateJWT = (roomName: string, isDoctor: boolean, patientName?: string): string => {
  console.log('Generating JWT for room:', roomName);
  console.log('Is doctor:', isDoctor);
  console.log('Patient name:', patientName);
  
  const APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID
  let PRIVATE_KEY = process.env.JAAS_PRIVATE_KEY

  console.log('APP_ID:', APP_ID);
  console.log('Private key exists:', !!PRIVATE_KEY);

  if (!APP_ID || !PRIVATE_KEY) {
    console.error('Missing JaaS credentials')
    return ''
  }

  try {
    // Format the private key
    PRIVATE_KEY = formatPrivateKey(PRIVATE_KEY)
    console.log('Private key formatted successfully');
    
    const now = Math.floor(Date.now() / 1000)
    console.log('Current timestamp:', now);
    
    // Create a unique user ID based on role and timestamp
    const userId = isDoctor ? `doctor-${now}` : `patient-${now}`;
    
    const payload: JaaSJWTPayload = {
      aud: 'jitsi',
      iss: 'chat',
      sub: APP_ID,
      room: '*',
      exp: now + 7200,
      nbf: now - 5,
      context: {
        user: {
          id: userId,
          name: isDoctor ? 'Dr. Smith' : patientName || 'Patient',
          email: 'demo@example.com',
          moderator: true,
          'hidden-from-recorder': false
        },
        features: {
          livestreaming: true,
          recording: true,
          transcription: true,
          'sip-inbound-call': true,
          'sip-outbound-call': true,
          'outbound-call': true,
          'inbound-call': true
        },
        room: {
          regex: true
        }
      }
    }

    console.log('JWT Payload:', payload);

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: `${APP_ID}/071809`
    };

    console.log('JWT Header:', header);

    try {
      const token = KJUR.jws.JWS.sign(
        'RS256',
        header,
        payload,
        PRIVATE_KEY,
        'PKCS8PEM'
      );

      console.log('JWT signed successfully!');
      console.log('Token preview:', token.substring(0, 50) + '...');
      
      // Add JWT verification
      const decoded = decodeJWT(token);
      if (!decoded) {
        console.error('Failed to verify JWT');
        return '';
      }

      return token;
    } catch (signError) {
      console.error('JWT signing failed:', signError);
      return '';
    }
  } catch (error) {
    console.error('JWT generation error:', error);
    return ''
  }
}

