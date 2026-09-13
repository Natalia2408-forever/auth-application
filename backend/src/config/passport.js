import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.js';

async function findOrCreateOAuthUser({ provider, providerId, email, name }) {
  const providerField = `${provider}Id`;

  let user = await User.findOne({ where: { [providerField]: providerId } });

  if (user) {
    return user;
  }

  if (email) {
    user = await User.findOne({ where: { email } });
  }

  if (user) {
    user[providerField] = providerId;
    await user.save();

    return user;
  }

  return User.create({
    name,
    email,
    [providerField]: providerId,
    });
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_HOST}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.API_HOST}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: 'facebook',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_HOST}/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: 'github',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName || profile.username,
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
}

export { passport };

export const enabledOAuthProviders = {
  google: Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  ),
  facebook: Boolean(
    process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET,
  ),
  github: Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  ),
};
