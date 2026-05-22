<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';


    let { data } = $props();
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let filtroSitios = $state<string[]>([]);
    let filtroFecha = $state('');

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

</script>

<div class="w-full h-full bg-gray-400 p-5">
    <h1 class="flex m-5 font-bold text-[50px] sm:text-[50px] sm:justify-center">Sesiones:</h1>
    <fieldset>
        <legend>Filtros</legend>
        {#each localidades as localidad}
            <label>
                <input
                    type="checkbox"
                    value={localidad}
                    bind:group={filtroSitios}/>
                {localidad}
            </label>
        {/each}
    </fieldset>

    <input type="date" bind:value={filtroFecha}>

    <button onclick={clearFiltros}>Limpiar filtros</button>
    <div class="m-2.5 justify-evenly align-center 
    flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    gap-4 bg-gray-200 p-5 rounded-lg">
        {#each eventosFiltrados as activity}
            <a href={`/sessions/${activity.id}`} class="block m-2.5 p-2.5 hover:scale-105 transition 
                duration-300 active:bg-blue-300 active:scale-110 bg-gray-300 rounded-[3mm]">
                <div class="ml-2 mr-2">
                    <span class="text-5 sm:text-[24px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-2 mb-2">
                    <span class="text-[16px] sm:text-[18px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
                <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url)['original']}`} 
                alt={activity.activity_name} class="w-full h-75 object-cover rounded-[3mm] mt-2.5" />
            </a>
        {/each}
    </div>
</div>