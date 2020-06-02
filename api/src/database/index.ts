import mongoose from 'mongoose';

import { MONGO_URL } from '../configs/env';

mongoose.connect(
	MONGO_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	(err) => {
		if (err) throw err;

		// tslint:disable-next-line: no-console
		console.log('database connected!');
	}
);

mongoose.Promise = global.Promise;

export default mongoose;
