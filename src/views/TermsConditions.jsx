import { Box, Container, Typography } from '@mui/material';

const TermsConditions = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4 }}>
        Terms and Conditions
      </Typography>
      
      <Box sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        <Typography paragraph><strong>Last Updated: {new Date().toLocaleDateString()}</strong></Typography>
        
        <Typography paragraph>
          Welcome to LUXE. These Terms and Conditions outline the rules and regulations for the use of our website and services.
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use our site if you do not agree to all of the terms and conditions stated on this page.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          1. Use of the Website
        </Typography>
        <Typography paragraph>
          You must be at least 18 years of age to use this website. You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          2. Products and Pricing
        </Typography>
        <Typography paragraph>
          All products and prices are subject to change without notice. We make every effort to display as accurately as possible the colors and images of our products. However, we cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          3. Payment and Billing
        </Typography>
        <Typography paragraph>
          We use secure payment gateways (such as Razorpay) for all transactions. By submitting payment information, you represent that you are authorized to use the payment method provided. We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you via email or phone.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          4. Returns and Refunds
        </Typography>
        <Typography paragraph>
          Our Returns and Refunds policy is outlined on our Returns page. Please review that page for detailed information regarding the conditions under which we accept returns and issue refunds.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          5. Intellectual Property
        </Typography>
        <Typography paragraph>
          Unless otherwise stated, LUXE and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from LUXE for your own personal use subjected to restrictions set in these terms and conditions.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2, color: 'text.primary' }}>
          6. Limitation of Liability
        </Typography>
        <Typography paragraph>
          In no event shall LUXE, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this website. LUXE will not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsConditions;
