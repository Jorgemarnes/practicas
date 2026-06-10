<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { ssrModuleExportsKey } from 'vite/module-runner';
    import { writable } from 'svelte/store';


    let { data } = $props();
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let filtroSitios = $state<string[]>([]);
    let filtroFecha = $state('');
    const min_date = new Date(Date.now()).toISOString().split('T')[0];

    let isOpen = $state(false);

    const eventosFiltrados = $derived(
        data.activities.filter(filtrados => {
            const fechaEvento = filtrados.date_start.split('T')[0];
            const casaFecha = !filtroFecha || new Date(fechaEvento) <= new Date(filtroFecha);
            return casaFecha;
        })
    );

    function clearFiltros() {
        filtroFecha = '';
    }

    function toggleMenu() {
        isOpen = !isOpen;    
    }
</script>
    <div id="container" class="w-screen h-screen bg-[#f6f6f6] mx-0 overflow-x-hidden">
        <h1 class="flex p-5 mb-5 font-bold text-[45px] sm:text-[45px] sm:justify-center">Sesiones:</h1>
        <div class="mb-2.5 align-center 
            flex-wrap gap-4 bg-[#f6f6f6]  p-5  flex z-5">
            <fieldset>
                <button class ="text-xl font-bold hover:underline p-2" onclick={toggleMenu}>Filtros</button>
                {#if isOpen}
                <div id ="filters" class="m-2.5 align-center 
                flex-wrap gap-4 bg-[#f6f6f6] flex"
                transition:slide={{ duration: 300}}>
                <label class=" self-center text-[16px]" for="fecha">Hasta:</label>
                <input id="fecha" type="date" min="{min_date}" bind:value={filtroFecha}
                class="border rounded bg-blue-50"/>
                <div class="basis-full"></div>
                <button onclick={clearFiltros} class=" bg-gray-300 py-1 px-3 rounded">Limpiar filtros</button>
                </div>
                {/if}
            </fieldset>
        </div>

    <div class="justify-evenly align-center 
    flex-wrap grid grid-cols-1 
    gap-4 bg-[#f6f6f6] mx-auto px-20 md:w-[90vw} xl:w-screen xl:min-w-300">
        {#each eventosFiltrados as activity}
            <a href={`/sessions/${activity.id}`} class="flex my-2.5 w-full xl:w-full h-60 hover:scale-105 transition
                duration-300 active:bg-blue-300 active:scale-110 border-2 border-black hover:bg-black hover:text-white">
                <div class="flex w-[20%] bg-[#5a1d89] overflow-hidden justify-center min-w-2xs hidden md:block">
                    <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url || '{}')['medium']}`} 
                    alt={activity.activity_name} class="h-full w-full object-cover scale-125" />
                </div>
                <div class="flex flex-col ml-2 mr-2 h-full py-5 px-2 justify-end" >
                    <span class="text-5 text-[28px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-1 mb-1">
                    <span class="text-[16px] sm:text-[16px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
            </a>
        {/each}
            <button id="scrollTop" class="fixed flex top-[90%] left-[80%] px-4 py-2
             bg-black text-white text-2xl text-center opacity-90 md:hidden">^</button>
</div>
</div>