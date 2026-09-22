import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from 'passport-github2';
import {
  InferAttributes,
  InferCreationAttributes,
  WhereOptions,
} from 'sequelize';
import { User, UserModel } from '../models/user.js';
import { OAuthProvider, ProviderField } from '../types/user.js';

type OAuthUserData = {
  provider: OAuthProvider;
  providerId: string;
  email: string | null;
  name: string;
};

type OAuthDone = (error: Error | null, user?: UserModel) => void;

async function findOrCreateOAuthUser({
  provider,
  providerId,
  email,
  name,
}: OAuthUserData): Promise<UserModel> {
  const providerField: ProviderField = `${provider}Id`;

  const byProvider = { [providerField]: providerId } as WhereOptions<
    InferAttributes<UserModel>
  >;

  let user = await User.findOne({ where: byProvider });

  if (user) {
    return user;
  }

  if (email) {
    user = await User.findOne({ where: { email } });
  }

  if (user) {
    user.setDataValue(providerField, providerId);
    await user.save();

    return user;
  }

  const attributes = { name, email } as InferCreationAttributes<UserModel>;

  attributes[providerField] = providerId;

  return User.create(attributes);
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${process.env.API_HOST}/auth/google/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile,
        done: OAuthDone,
      ) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value ?? null,
            name: profile.displayName ?? '',
          });

          done(null, user);
        } catch (error) {
          done(error instanceof Error ? error : new Error(String(error)));
        }
      },
    ),
  );
}

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (githubClientId && githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: `${process.env.API_HOST}/auth/github/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: OAuthDone,
      ) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: 'github',
            providerId: profile.id,
            email: profile.emails?.[0]?.value ?? null,
            name: profile.displayName || profile.username || '',
          });

          done(null, user);
        } catch (error) {
          done(error instanceof Error ? error : new Error(String(error)));
        }
      },
    ),
  );
}

export { passport };

export const enabledOAuthProviders: Record<OAuthProvider, boolean> = {
  google: Boolean(googleClientId && googleClientSecret),
  github: Boolean(githubClientId && githubClientSecret),
};
