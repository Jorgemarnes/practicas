<script lang="ts">
    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { data } = $props();

</script>

<h1 class="flex justify-center align-center m-[20px] font-bold text-2xl">Sesiones:</h1>

<div class="grid grid-cols-3 col-span-[1] gap-4">
    <ul>
        {#each data.activities as activity}
            <li><div class="flex justify-center align-center m-[20px]">
                <a class="hover:text-blue-500 hover:scale-110 transition duration-300"
            href={`/sessions/${activity.id}`}>{activity.activity_name}</a></div></li>
        {/each}
    </ul>
</div>