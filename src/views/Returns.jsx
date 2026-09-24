import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const steps = [
  {
    title: "Initiate Return",
    description: "Log into your account, go to 'Orders', and select the item(s) you wish to return. Generate a return label."
  },
  {
    title: "Pack Your Item",
    description: "Ensure the item is in its original condition with tags attached. Pack it securely in its original packaging."
  },
  {
    title: "Ship It Back",
    description: "Attach the provided shipping label to the outside of the box and drop it off at your nearest carrier location."
  },
  {
    title: "Receive Refund",
    description: "Once we receive and inspect your return, your refund will be processed within 3-5 business days."
  }
];

const Returns = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
        Returns & Exchanges
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
        We want you to love your purchase. If you're not completely satisfied, we gladly accept returns within 30 days.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>How to Return an Item</Typography>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    mr: 2
                  }}
                >
                  {index + 1}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Return Policy Details</Typography>
      <List sx={{ color: 'text.secondary' }}>
        <ListItem>
          <ListItemIcon><Typography variant="body1">▪</Typography></ListItemIcon>
          <ListItemText primary="Items must be returned within 30 days of the delivery date." />
        </ListItem>
        <ListItem>
          <ListItemIcon><Typography variant="body1">▪</Typography></ListItemIcon>
          <ListItemText primary="Merchandise must be unworn, unwashed, and in its original condition with all tags attached." />
        </ListItem>
        <ListItem>
          <ListItemIcon><Typography variant="body1">▪</Typography></ListItemIcon>
          <ListItemText primary="Final sale items, intimates, and gift cards cannot be returned." />
        </ListItem>
        <ListItem>
          <ListItemIcon><Typography variant="body1">▪</Typography></ListItemIcon>
          <ListItemText primary="Original shipping charges are non-refundable." />
        </ListItem>
      </List>
    </Container>
  );
};

export default Returns;
