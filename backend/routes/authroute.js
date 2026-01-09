const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Passport Google Strategy 
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // Create new user from Google profile
        const displayName = profile.displayName || (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : '');
        const nameParts = displayName ? displayName.split(' ').filter(part => part.length > 0) : [];
        
        let firstName = profile.name?.givenName || nameParts[0] || profile.displayName?.split(' ')[0] || 'User';
        let lastName = profile.name?.familyName || nameParts.slice(1).join(' ') || profile.displayName?.split(' ').slice(1).join(' ') || '';

        firstName = (firstName || 'User').trim();
        lastName = (lastName || firstName).trim(); 
        
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
            return done(new Error('Email is required from Google profile'), null);
        }
        user = new User({
            googleId: profile.id,
            email: email.toLowerCase().trim(),
            firstName: firstName,
            lastName: lastName,
            mobileNo: '0000000000',
            dateOfBirth: new Date('1990-01-01'),
            balance: 0
        });

        await user.save();
        return done(null, user);
    } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        return done(error, null);
    }
    }));
} else {
    console.warn(' Google OAuth credentials not found. Google sign-in will not work.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(503).json({ message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.' });
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/signin?error=google_auth_failed' }),
    async (req, res) => {
        try {
            const user = req.user;
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Redirect to frontend with token
            res.redirect(`http://localhost:3000/auth/callback?token=${token}&userId=${user._id}`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect('http://localhost:3000/signin?error=google_auth_failed');
        }
    }
);

// Alternative endpoint for frontend to get user data after Google auth
router.post('/google/verify', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNo: user.mobileNo,
                balance: user.balance,
            },
        });
    } catch (error) {
        console.error('Google verify error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
