import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import styles from './Dashboard.module.css';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { 'x-auth-token': token }
        };

        const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
        const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');

        const [summaryRes, transactionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/transactions/summary?startDate=${startDate}&endDate=${endDate}`, config),
          axios.get(`http://localhost:5000/api/transactions?startDate=${startDate}&endDate=${endDate}`, config)
        ]);

        if (!summaryRes.data) {
          throw new Error('No summary data received');
        }

        // Calculate totals from actual transaction data as a fallback
        const calculatedTotals = transactionsRes.data.reduce((acc, transaction) => {
          if (transaction.type === 'income') {
            acc.income += parseFloat(transaction.amount);
          } else {
            acc.expenses += parseFloat(transaction.amount);
          }
          return acc;
        }, { income: 0, expenses: 0 });

        // Use calculated totals if summary data is zero or undefined
        const finalSummary = {
          income: summaryRes.data.income || calculatedTotals.income,
          expenses: summaryRes.data.expenses || calculatedTotals.expenses,
          balance: (summaryRes.data.income || calculatedTotals.income) - 
                  (summaryRes.data.expenses || calculatedTotals.expenses)
        };

        const dailyTransactions = transactionsRes.data.reduce((acc, transaction) => {
          const date = dayjs(transaction.date).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = { income: 0, expenses: 0 };
          }
          if (transaction.type === 'income') {
            acc[date].income += parseFloat(transaction.amount);
          } else {
            acc[date].expenses += parseFloat(transaction.amount);
          }
          return acc;
        }, {});

        const monthlyTrends = Object.entries(dailyTransactions).map(([date, data]) => ({
          date,
          income: data.income,
          expenses: data.expenses,
          balance: data.income - data.expenses
        }));

        setMonthlyData(monthlyTrends);
        setSummary(finalSummary);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]); // Only depend on selectedDate changes

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const pieData = [
    {
      id: 'Income',
      label: 'Income',
      value: summary.income,
      color: 'rgb(76, 175, 80)'
    },
    {
      id: 'Expenses',
      label: 'Expenses',
      value: summary.expenses,
      color: 'rgb(244, 67, 54)'
    }
  ];

  const pieTheme = {
    background: 'transparent',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 11,
    textColor: '#333333',
    axis: {
      domain: {
        line: {
          stroke: '#777777',
          strokeWidth: 1
        }
      },
      ticks: {
        line: {
          stroke: '#777777',
          strokeWidth: 1
        }
      }
    },
    grid: {
      line: {
        stroke: '#dddddd',
        strokeWidth: 1
      }
    }
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            className={styles.card}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(76, 175, 80, 0.7) 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Income
            </Typography>
            <Typography component="p" variant="h4">
              ₹{summary.income.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            className={styles.card}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(244, 67, 54, 0.7) 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography component="p" variant="h4">
              ₹{summary.expenses.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            className={styles.card}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(33, 150, 243, 0.7) 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Balance
            </Typography>
            <Typography component="p" variant="h4">
              ₹{summary.balance.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper className={styles.chartContainer}
            sx={{
              p: 2,
              height: 400,
              borderRadius: 2,
              background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
            }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <ResponsivePie
                data={pieData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'category10' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
                arcLabelsRadiusOffset={0.6}
                arcLabelsFormat={value => `${((value / (summary.income + summary.expenses)) * 100).toFixed(1)}%`}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle'
                  }
                ]}
                theme={pieTheme}
                motionConfig="gentle"
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5" color="text.primary">
                  ₹{summary.balance.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper className={styles.chartContainer}
            sx={{
              p: 2,
              height: 'auto',
              borderRadius: 2,
              background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Daily Transactions
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month']}
                  label="Select Month"
                  minDate={dayjs('2020-01-01')}
                  maxDate={dayjs('2030-12-31')}
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveBar
                data={monthlyData}
                keys={['income', 'expenses']}
                indexBy="date"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={['#4caf50', '#f44336']}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Amount (₹)',
                  legendPosition: 'middle',
                  legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20
                  }
                ]}
                animate={true}
                motionConfig="gentle"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;