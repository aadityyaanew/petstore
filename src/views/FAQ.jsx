import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within the contiguous US. Express shipping takes 1-2 business days. International shipping times vary by location."
  },
  {
    question: "Can I track my order?",
    answer: "Yes! Once your order ships, you will receive a confirmation email with a tracking number and a link to track your package."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in their original packaging. Please visit our Returns page for detailed instructions."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times are calculated at checkout based on your location."
  }
];

const FAQ = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
        Frequently Asked Questions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
        Find answers to our most common questions below.
      </Typography>

      <Box sx={{ mt: 4 }}>
        {faqs.map((faq, index) => (
          <Accordion 
            key={index} 
            sx={{ 
              mb: 2, 
              boxShadow: 'none',
              '&:before': { display: 'none' },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px !important'
            }}
          >
            <AccordionSummary expandIcon={<Typography variant="h6">+</Typography>}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
