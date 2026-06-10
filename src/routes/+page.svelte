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
<div class="w-screen h-screen bg-[#ffffff] p-5 overflow-x-hidden">
    <div class="">
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->

    <!--CREACION DE HEADING Y FILTRO POR FECHA-->

        <h1 class="flex p-5 mb-5 font-bold text-[45px] sm:text-[45px] sm:justify-center mx-20">Sesiones:</h1>
        <div class="mb-2.5 align-center sm:justify-center
            flex-wrap gap-4 bg-[#ffffff] p-5 flex z-5">
            <fieldset class="flex flex-col w-full max-w-xs justify-center">
                <button class ="text-xl font-bold hover:underline p-2 mx-20 hover:scale-110 transition duration-150 active:scale-95" onclick={toggleMenu}>Filtros</button>
                {#if isOpen}
                    <div id ="filters" class="m-2.5 
                    flex-wrap gap-4 bg-[#ffffff] flex mx-20 justify-center"
                    transition:slide={{ duration: 300}}>
                    <label class="self-center text-[16px]" for="fecha">Hasta:</label>
                    <input id="fecha" type="date" min="{min_date}" bind:value={filtroFecha}
                    class="border rounded bg-blue-50 pl-2 pr-2 hover:bg-gray-400 hover:text-white
                    transition duration-150 hover:scale-108 hover:underline"/>
                    <div class="basis-full"></div>
                    <button onclick={clearFiltros} class=" bg-gray-300 py-1 px-3 rounded hover:bg-gray-400 hover:text-white
                    hover:scale-110 active:scale-95 transition duration-150 active:bg-gray-600">Limpiar filtros</button>
                    </div>
                {/if} 
            </fieldset>
        </div>
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->

    <!--CREACION DE CADA SESION Y ORGANIZACION DE LA LISTA-->

        <div class="justify-self-center self-center justify-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
        bg-[#ffffff] gap-5">
            {#each eventosFiltrados as activity}
                <a href={`/sessions/${activity.id}`} class="flex flex-col m-1 w-80 h-60 hover:scale-110 transition
                    duration-150 active:bg-blue-300 active:scale-95 bg-[#5a1d89] text-amber-50 hover:bg-black border-black border-2">
                    <div class="h-[60%] bg-amber-200 overflow-hidden">
                        <img src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url || '{}')['medium']}`} 
                        alt={activity.activity_name} class="w-full h-full object-cover scale-125"/>
                    </div>
                    <div class="ml-2 mr-2 h-[40%] pt-2 grid row-span-3">
                        <span class="text-5 sm:text-[16px] active:scale-110 font-bold h-5"
                        >{activity.activity_name}</span>
                        <div class="h-5 py-4">
                            <hr/>
                            <span class="text-[16px] sm:text-[16px] italic h-5"
                            >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                        </div>
                    </div>
                </a>
            {/each}
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
        </div>
    </div>
</div>