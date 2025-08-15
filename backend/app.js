const userRoutes = require('./routes/userroute');
const transactionRoutes = require('./routes/transictionroute');
const qrCodeRoutes = require('./routes/qrcoderoute');

// Routes
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/qrcode', qrCodeRoutes); 