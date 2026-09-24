import { useState } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send data to backend here
    console.log('Form data:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8, minHeight: '60vh' }}>
      <Grid container spacing={8}>
        {/* Contact Info */}
        <Grid item xs={12} md={5}>
          <Box sx={{ pr: { md: 4 } }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
              Get in Touch
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
              Have a question, feedback, or need assistance? We're here to help. Reach out to us using the form or our contact details.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Address</Typography>
              <Typography color="text.secondary">
                123 Luxe Avenue, Suite 400<br />
                New York, NY 10001<br />
                United States
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Contact</Typography>
              <Typography color="text.secondary">
                Email: support@luxe.com<br />
                Phone: +1 (800) 123-4567
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Business Hours</Typography>
              <Typography color="text.secondary">
                Monday - Friday: 9am - 6pm EST<br />
                Saturday: 10am - 4pm EST<br />
                Sunday: Closed
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Send a Message</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Email Address" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    sx={{ py: 1.5, px: 4, fontWeight: 700, borderRadius: 2 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar open={submitted} autoHideDuration={6000} onClose={() => setSubmitted(false)}>
        <Alert onClose={() => setSubmitted(false)} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We will get back to you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUs;
