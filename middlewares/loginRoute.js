const {
    RateLimiterMongo
} = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const mongoConn = `mongodb://localhost:27017/Database_Assignment4_Tournament`

const maxConsecutiveFailsByUsernameAndIP = 5;


const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24, 
    blockDuration: 60 * 10 
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

async function loginRoute(req, res) {
    const ipAddr = req.connection.remoteAddress;
    const usernameIPkey = getUsernameIPkey(req.body.username, ipAddr);

    const resUsernameAndIP = await Promise.all(
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    )

    let retrySecs = 0;

    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        res.status(429).send('Too Many Requests');
    } else {
        User.findOne({
                username: req.body.username
            })
            .populate("districts")
            .exec((err, user) => {
                if (err) {
                    res.status(500).json({
                        message: err
                    });
                    return;
                }

                if (user === null) {
                    await Promise.all(promises);
                    return res.status(401).json({
                        access_token: null,
                        message: "Kombinasi username dan password tidak ditemukan",
                    });
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                )

                if (!passwordIsValid) {
                    if (user) {
                        // Count failed attempts by Username + IP only for registered users
                        promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
                      }
                    await Promise.all(promises);
                    return res.status(401).json({
                        access_token: null,
                        message: "Kombinasi username dan password tidak ditemukan",
                    });
                }

                var token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        teams: user.teams,
                        roles: user.role_name,
                        birthdate: user.birthdate,
                        districts: user.districts
                    },
                    "Assignment4", {
                        expiresIn: 86400,
                    }
                )

                if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
                    // Reset on successful authorisation
                    await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
                }

                var districts = user.districts.district_name;
                res.status(200).json({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    birthdate: user.birthdate,
                    phone: user.phone,
                    roles: user.role_name,
                    access_token: token,
                    districts: districts,
                });
            });
    }
}