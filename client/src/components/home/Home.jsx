import { Box, Container, Typography, Button, Grid, Paper, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import { keyframes } from '@emotion/react';

function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const pulse = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `;

  const features = [
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
      title: 'Track Your Finances',
      description: 'Monitor your income and expenses in one place with our intuitive dashboard.',
      action: () => navigate('/dashboard'),
      progress: 75
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 48 }} />,
      title: 'Analyze Trends',
      description: 'Visualize your spending patterns and make informed financial decisions.',
      action: () => navigate('/dashboard'),
      progress: 85
    },
    {
      icon: <AddCircleOutlineIcon sx={{ fontSize: 48 }} />,
      title: 'Manage Transactions',
      description: 'Easily add and categorize your transactions to keep your finances organized.',
      action: () => navigate('/transactions'),
      progress: 90
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Data Security',
      description: 'Advanced encryption and secure storage to protect your sensitive financial information.',
      action: () => navigate('/dashboard'),
      progress: 95
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
          '100%': {
            backgroundPosition: '0% 50%'
          }
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ pt: 8, pb: 6 }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4
            }}
          >
            Personal Expense Tracker
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Take control of your finances with our powerful expense tracking tool.
            Monitor your spending, analyze trends, and make informed decisions about your money.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/transactions')}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none'
              }}
            >
              View Transactions
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.2)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)'
                  }
                }}
                onClick={feature.action}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2.5,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    animation: `${pulse} 2s infinite ease-in-out`,
                    boxShadow: '0 8px 16px rgba(33,150,243,0.3)'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Box sx={{ width: '100%', mt: 'auto' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Feature Completion
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={feature.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #2196F3, #21CBF3)'
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;