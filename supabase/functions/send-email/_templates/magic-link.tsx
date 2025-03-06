
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Img,
} from 'npm:@react-email/components@0.0.7'
import * as React from 'npm:react@18.2.0'

interface MagicLinkEmailProps {
  magicLink: string;
  host: string;
}

export const MagicLinkEmail = ({
  magicLink,
  host,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in to Bleacher Banter with this magic link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerContainer}>
          <Heading style={header}>Bleacher Banter</Heading>
        </Section>
        <Section style={content}>
          <Heading style={h2}>Magic Link Login</Heading>
          <Text style={text}>
            Click the button below to log in to your Bleacher Banter account. This link is valid for 24 hours.
          </Text>
          <Link
            href={magicLink}
            target="_blank"
            style={button}
          >
            Login to Bleacher Banter
          </Link>
          <Text style={smallText}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>
            {magicLink}
          </Text>
          <Text style={footer}>
            If you didn't request this login link, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const headerContainer = {
  backgroundColor: '#C41E3A', // School red color
  padding: '20px',
  borderRadius: '6px 6px 0 0',
  textAlign: 'center' as const,
}

const header = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: 'bold',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '0 0 6px 6px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
}

const button = {
  backgroundColor: '#C41E3A', // School red color
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '0 0 20px',
}

const smallText = {
  color: '#666',
  fontSize: '14px',
  margin: '10px 0 5px',
}

const linkText = {
  color: '#0C2340', // School navy color
  fontSize: '14px',
  lineHeight: '20px',
  wordBreak: 'break-all' as const,
  margin: '0 0 20px',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '30px 0 0',
}
