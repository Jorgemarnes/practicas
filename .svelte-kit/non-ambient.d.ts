
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
<<<<<<< HEAD
		RouteId(): "/" | "/api" | "/api/activities" | "/api/users" | "/api/users/[id]" | "/sessions" | "/sessions/[id]";
=======
		RouteId(): "/" | "/api" | "/api/activities" | "/api/events" | "/api/rooms" | "/api/sessions" | "/api/sessions/[id]" | "/api/users" | "/event" | "/sessions" | "/sessions/events" | "/sessions/[id]";
>>>>>>> 90ac50e648dd5a25b50c79d420ba0ca0ce3e7b78
		RouteParams(): {
			"/api/sessions/[id]": { id: string };
			"/sessions/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/activities": Record<string, never>;
<<<<<<< HEAD
			"/api/users": { id?: string };
			"/api/users/[id]": { id: string };
=======
			"/api/events": Record<string, never>;
			"/api/rooms": Record<string, never>;
			"/api/sessions": { id?: string };
			"/api/sessions/[id]": { id: string };
			"/api/users": Record<string, never>;
			"/event": Record<string, never>;
>>>>>>> 90ac50e648dd5a25b50c79d420ba0ca0ce3e7b78
			"/sessions": { id?: string };
			"/sessions/[id]": { id: string }
		};
		Pathname(): "/" | "/api/activities" | "/api/rooms" | "/api/sessions" | `/sessions/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/calendar-dots.png" | "/file-text.png" | "/foto.jpg" | "/map-pin.png" | "/robots.txt" | "/users-three.png" | string & {};
	}
}