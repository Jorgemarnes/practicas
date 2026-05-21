
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
		RouteId(): "/" | "/api" | "/api/activities" | "/api/users" | "/api/users/[id]" | "/event" | "/sessions" | "/sessions/[id]";
		RouteParams(): {
			"/api/users/[id]": { id: string };
			"/sessions/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/activities": Record<string, never>;
			"/api/users": { id?: string };
			"/api/users/[id]": { id: string };
			"/event": Record<string, never>;
			"/sessions": { id?: string };
			"/sessions/[id]": { id: string }
		};
		Pathname(): "/" | "/api/activities" | "/api/users" | `/api/users/${string}` & {} | `/sessions/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/calendar-dots.png" | "/file-text.png" | "/foto.jpg" | "/map-pin.png" | "/robots.txt" | "/users-three.png" | string & {};
	}
}