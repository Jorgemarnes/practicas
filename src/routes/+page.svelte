<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    import { slide } from 'svelte/transition';


    let { data } = $props();
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let filtroSitios = $state<string[]>([]);
    let filtroFecha = $state('');

    let isOpen = $state(false);

    const localidades = $derived(
        [...new Set(data.activities.map((activity: ActivityInfo) => activity.places_name))].sort()
    );
    
    

    const eventosFiltrados = $derived(
        data.activities.filter(filtrados => {
            const fechaEvento = filtrados.date_start.split('T')[0];
            const casaSitio =
                filtroSitios.length === 0 || filtroSitios.includes(filtrados.places_name);
            const casaFecha = !filtroFecha || fechaEvento === filtroFecha;
            return casaSitio && casaFecha;
        })
    );

    function clearFiltros() {
        filtroSitios = [];
        filtroFecha = '';
    }

    function toggleMenu() {
        isOpen = !isOpen;   

    }

</script>

    <div class="w-screen h-full bg-gray-400 p-5 mx-0 overflow-x-hidden">
        <h1 class="flex mb-5 font-bold text-[50px] sm:text-[50px] sm:justify-center">Sesiones:</h1>
        <div class="mb-2.5 align-center 
        flex-wrap gap-4 bg-gray-200 p-5  flex z-5">
            <fieldset>
                <button class ="text-xl font-bold hover:underline p-2" onclick={toggleMenu}>Filtros</button>
                {#if isOpen}
                <div id ="filters" class="m-2.5 align-center 
        flex-wrap gap-4 bg-gray-200 flex"
        transition:slide={{ duration: 300}}>
                <div class="bg-blue-50 border p-5 gap-5">
                {#each localidades as localidad}
                    <label class="float-left ml-2 mr-2">
                        <input
                            type="checkbox"
                            value={localidad}
                            bind:group={filtroSitios}/>
                        {localidad}
                    </label>
                {/each}
                </div>
                <input type="date" class="border bg-blue-50 pl-2 pr-2"bind:value={filtroFecha}>
                <div class="basis-full"></div>
                <button onclick={clearFiltros} class=" bg-gray-300 p-2">Limpiar filtros</button>
                </div>
                {/if}
            </fieldset>
            
        </div>
    
    
    
    <div class="justify-items-center align-center 
    flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    gap-4 bg-gray-200 p-5">
        {#each eventosFiltrados as activity}
            <a href={`/sessions/${activity.id}`} class="flex flex-col m-2.5 w-80 h-60 hover:scale-105 transition 
                duration-300 active:bg-blue-300 active:scale-110 bg-[#5a1d89] text-amber-50">
                <div class="h-[60%] bg-amber-200 overflow-hidden ">
                    <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url)['original']}`} 
                    alt={activity.activity_name} class="w-full h-full object-cover scale-125" />
                </div>
                <div class="ml-2 mr-2 h-[40%] pt-2">
                    <span class="text-5 sm:text-[16px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-1 mb-1">
                    <span class="text-[16px] sm:text-[16px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
                
            </a>
        {/each}
    </div>
</div>