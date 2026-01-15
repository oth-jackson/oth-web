import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export const ContactEmailTemplate = ({
  name,
  email,
  company,
  message
}: ContactEmailTemplateProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px' }}>
        <Text style={{ color: '#333', fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #0066cc', paddingBottom: '10px' }}>
          New Contact Form Submission
        </Text>

        <Section style={{ marginTop: '20px' }}>
          <Text style={{ margin: '10px 0' }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ margin: '10px 0' }}>
            <strong>Email:</strong> {email}
          </Text>
          {company && (
            <Text style={{ margin: '10px 0' }}>
              <strong>Company:</strong> {company}
            </Text>
          )}
          <Section style={{ marginTop: '20px' }}>
            <Text style={{ fontWeight: 'bold' }}>Message:</Text>
            <Text style={{
              marginTop: '10px',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px',
              whiteSpace: 'pre-wrap'
            }}>
              {message}
            </Text>
          </Section>
        </Section>

        <Hr style={{ marginTop: '30px', borderColor: '#ddd' }} />

        <Text style={{ color: '#666', fontSize: '12px', marginTop: '20px' }}>
          This email was sent from the Otherwise contact form.
        </Text>
      </Container>
    </Body>
  </Html>
);
