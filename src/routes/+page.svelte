<script lang="ts">
    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { data } = $props();

</script>

<h1>Sesiones</h1>

<ul>
    {#each data.activities as activity}
        <li><a href={`/sessions/${activity.id}`}>{activity.activity_name}</a></li>
    {/each}
</ul>