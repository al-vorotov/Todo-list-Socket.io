declare namespace NodeJS {
	export interface ProcessEnv {
		MONGO_URL: string;
		SECRET_HASH: string;
		PORT: number;
	}
}

declare namespace Express {
	interface Request {
		_id: string | undefined;
	}
}

declare module 'custom-env';
