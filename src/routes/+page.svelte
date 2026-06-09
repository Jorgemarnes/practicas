<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    import { slide } from 'svelte/transition';

    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;

    //CREACION DE VARIABLES

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

    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;

    //FUNCIONES
    function clearFiltros() {
        filtroFecha = '';
    }

    function toggleMenu() {
        isOpen = !isOpen;   

    }
    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;
    /---------------------------------------------------------------------------------------------------------------------/;

</script>
    <div class="w-screen h-screen bg-[#f6f6f6] p-5 mx-0 overflow-x-hidden">
    <!--CREACION DE HEADING Y FILTRO POR FECHA-->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
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
                class="border rounded bg-blue-50 pl-2 pr-2"/>
                <div class="basis-full"></div>
                <button onclick={clearFiltros} class=" bg-gray-300 py-1 px-3 rounded">Limpiar filtros</button>
                </div>
                {/if}
            </fieldset>
        </div>
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->

    <!--CREACION DE CADA SESION Y ORGANIZACION DE LA LISTA-->

    <div class="justify-items-center align-center 
    flex-wrap grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
    gap-4 bg-[#f6f6f6]  p-5">
        {#each eventosFiltrados as activity}
            <a href={`/sessions/${activity.id}`} class="flex flex-col m-2.5 w-80 h-60 hover:scale-105 transition
                duration-300 active:bg-blue-300 active:scale-110 bg-[#5a1d89] text-amber-50 hover:bg-black">
                <div class="h-[60%] bg-amber-200 overflow-hidden ">
                    <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url || '{}')['medium']}`} 
                    alt={activity.activity_name} class="w-full h-full object-cover scale-125" />
                </div>
                <div class="ml-2 mr-2 h-[40%] pt-2 " >
                    <span class="text-5 sm:text-[16px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-1 mb-1">
                    <span class="text-[16px] sm:text-[16px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
            </a>
        {/each}
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    </div>
</div>