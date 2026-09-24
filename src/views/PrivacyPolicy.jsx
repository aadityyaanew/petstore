import { Box, Container, Typography } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4 }}>
        Privacy Policy
      </Typography>
      
      <Box sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        <Typography paragraph><strong>Last Updated: {new Date().toLocaleDateString()}</strong></Typography>
        
        <Typography paragraph>
          At LUXE, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and use our services.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We may collect personal information that you provide directly to us, such as your name, email address, shipping address, phone number, and payment information when you make a purchase or create an account. We also automatically collect certain information about your device and usage of our site through cookies and similar technologies.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the information we collect to:
          <ul>
            <li>Process and fulfill your orders, including sending emails to confirm your order status.</li>
            <li>Communicate with you about products, services, offers, and promotions.</li>
            <li>Provide customer support.</li>
            <li>Improve and optimize our website and user experience.</li>
            <li>Protect against fraudulent transactions and ensure the security of our services.</li>
          </ul>
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          3. Sharing Your Information
        </Typography>
        <Typography paragraph>
          We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers (such as payment processors like Razorpay, and shipping carriers) who assist us in operating our website and processing your orders. These providers are obligated to keep your information confidential.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          4. Security
        </Typography>
        <Typography paragraph>
          We implement a variety of security measures, including SSL encryption, to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          5. Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us at support@luxe.com.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
