import mongoose from "mongoose";

export default class Database {
	#connectionAttempts = 0;
	#uri;

	constructor(uri) {
		this.#uri = uri;
	}

	connect = async () => {
		do {
			try {
				this.#connectionAttempts++;
				await mongoose.connect(this.#uri);
				return console.log(
					`Database connection to ${this.#uri} was successful`
				);
			} catch (e) {
				console.log("Database connection error", e);
				setTimeout(() => this.connect(), 3000);
			}
		} while (this.#connectionAttempts <= 1);
		this.#connectionAttempts === 10 && console.log("Database unavailable");
	};

	close = async () => {
		await mongoose.disconnect();
	};
}
