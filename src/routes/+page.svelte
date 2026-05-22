<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';


    let { data } = $props();
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


</script>

<div class="w-full h-full bg-gray-400 p-[20px]">
    <h1 class="flex m-[20px] font-bold text-[50px] sm:text-[50px] sm:justify-center">Sesiones:</h1>

    <div class="m-[10px] justify-evenly align-center 
    flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    gap-4 bg-gray-200 p-[20px] rounded-lg">
        {#each data.activities as activity}
            <a href={`/sessions/${activity.id}`} class="block m-[10px] p-[10px] hover:scale-105 transition 
                duration-300 active:bg-blue-300 active:scale-110 bg-gray-300 rounded-[3mm]">
                <div class="ml-2 mr-2">
                    <span class="text-[20px] sm:text-[24px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-2 mb-2">
                    <span class="text-[16px] sm:text-[18px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
                <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url)['original']}`} 
                alt={activity.activity_name} class="w-full h-[300px] object-cover rounded-[3mm] mt-[10px]" />
            </a>
        {/each}
    </div>
</div>