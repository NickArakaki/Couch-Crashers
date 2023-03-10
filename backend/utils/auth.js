const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends JWT Cookie
const setTokenCookie = (res, user) => {
    // create token
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800s = 1 week
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // set token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in ms
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
}

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPaylaod) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPaylaod.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    })
}

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.error = ['Authentication required'];
    err.status = 401;
    return next(err);
}

const requireAuthorization = () => {
    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.error = ['Forbidden'];
    err.status = 403;
    throw err;
}

module.exports = { setTokenCookie, restoreUser, requireAuth };
