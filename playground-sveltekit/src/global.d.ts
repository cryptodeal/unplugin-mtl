/// <reference types="@sveltejs/kit" />

declare namespace NodeJS {
	interface ProcessEnv {
		SERVER_ENV: string;
	}
}
