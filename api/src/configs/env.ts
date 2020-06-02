import customEnv from 'custom-env';

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') {
	customEnv.env('development');
} else if (NODE_ENV === 'production') {
	customEnv.env('production');
} else {
	customEnv.env();
}

export const { MONGO_URL } = process.env;
export const { PORT } = process.env;
export const { CLIENT } = process.env;

