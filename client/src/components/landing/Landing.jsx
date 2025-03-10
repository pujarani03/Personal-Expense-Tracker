import { Box, Container, Typography, Button, Grid, Fade, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountBalanceWallet, Timeline, Security } from '@mui/icons-material';

function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 48 }} />,
      title: 'Track Expenses',
      description: 'Easily record and categorize your daily expenses'
    },
    {
      icon: <Timeline sx={{ fontSize: 48 }} />,
      title: 'Visualize Data',
      description: 'View your spending patterns with intuitive charts'
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Storage',
      description: 'Your financial data is encrypted and secure'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 4,
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Personal Expense Tracker
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  opacity: 0.9
                }}
              >
                Take control of your finances with our easy-to-use expense tracking solution
              </Typography>
              <Box sx={{ mt: 6 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    mr: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 12 } }} maxWidth="lg">
        <Fade in={true} timeout={1500}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 8,
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              Features
            </Typography>
            <Grid container spacing={6}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 3,
                        transform: 'scale(1)',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Landing;