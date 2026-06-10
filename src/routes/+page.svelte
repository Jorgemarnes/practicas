<script lang="ts">

    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    import { slide } from 'svelte/transition';
    import { Container } from 'postcss';
    import { onMount } from 'svelte';


    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;

    //CREACION DE VARIABLES

    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    //SEPARAR LOS DATOS
    let { data } = $props();

    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
   
    //RESTO DE VARIABLES
    
    const eventosFiltrados = $derived(
        data.activities.filter(filtrados => {
            const fechaEvento = filtrados.date_start.split('T')[0];
            const casaFecha = !filtroFecha || new Date(fechaEvento) <= new Date(filtroFecha);
            return casaFecha;
        })
    );
    
    let filtroSitios = $state<string[]>([]);
    let filtroFecha = $state('');
    const min_date = new Date(Date.now()).toISOString().split('T')[0];
    let isOpen = $state(false);
    let isGrid = $state(true);

    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;

    
    //FUNCIONES

    function clearFiltros() {
        filtroFecha = '';
    }

    function toggleMenu() {
        isOpen = !isOpen;    
    }

    function showButton() {
        const scrollButton = document.getElementById('scrollTop') as HTMLElement;
        let container = document.getElementById('container') as HTMLElement;
        if (container.scrollTop > 25){
            scrollButton.hidden = false;
        } else {
            scrollButton.hidden = true;
        }
    }

    function backToTop() {
        let container = document.getElementById('container') as HTMLElement;
        container.scrollTo({top: 0, behavior: 'smooth'});
        console.log(container.scrollTop)
    }

    function toggleGrid() {
        if (isGrid){
            isGrid = false;
        // VISTA DE LISTA
        } else if (!isGrid) {
            isGrid = true;
        }
        console.log(isGrid)
    }
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;
    /*/---------------------------------------------------------------------------------------------------------------------/*/;

    onMount(() => {
        const scrollButton = document.getElementById('scrollTop') as HTMLElement;
        let container = document.getElementById('container') as HTMLElement;
        container.onscroll = function() {showButton()};
    })


</script>
    <div id="container" class="w-screen h-screen bg-[#f6f6f6] mx-0 overflow-x-hidden">
        <h1 class="flex p-5 mb-5 font-bold text-[45px] sm:text-[45px] sm:justify-center">Sesiones:</h1>

    <!--MENÚ FILTROS-->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
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

    <!--GRID EVENTOS-->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <!--------------------------------------------------------------------------------------------------------------------->
    <button onclick={toggleGrid} class="hidden md:flex mx-20 mb-10 p-3 bg-[#5a1d89] hover:bg-black rounded-xl">
        {#if !isGrid}
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#ffffff" viewBox="0 0 256 256"><path d="M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,
        20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,80H140V60h56ZM116,60v56H60V60ZM60,140h56v56H60Zm80,56V140h56v56Z" class=""></path></svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#ffffff" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,
        12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z"></path></svg>
        {/if}
    </button>
    {#if !isGrid}
    <div id="gridContainer"class="justify-evenly align-center 
    flex-wrap grid grid-cols-1 
    gap-4 bg-[#f6f6f6] mx-auto px-20 md:w-[90vw} xl:w-screen xl:min-w-300">
        {#each eventosFiltrados as activity}
            <a id="card" href={`/sessions/${activity.id}`} class="flex mx-1 my-2.5 w-full xl:w-full h-40 md:h-60 hover:scale-105 transition
                duration-300 active:bg-blue-300 active:scale-110 border-2 border-black hover:border-white hover:bg-[#5a1d89] hover:text-white">
                <div id="imgContainer" class="flex w-[20%] bg-[#5a1d89] overflow-hidden justify-center min-w-2xs hidden md:block">
                    <img id="img" src={`${import.meta.env.VITE_TICKETARY_API}${JSON.parse(activity.url || '{}')['medium']}`} 
                    alt={activity.activity_name} class="h-full w-full object-cover scale-125" />
                </div>
                <div id="textContainer" class="flex flex-col ml-2 mr-2 h-full py-5 px-2 justify-end" >
                    <span id="title" class="text-5 text-[16px] md:text-[26px] active:scale-110 font-bold"
                    >{activity.activity_name}</span>
                    <hr class="mt-1 mb-1">
                    <span id="details" class="text-[16px] sm:text-[16px] italic"
                    >{activity.day} de {MONTHS[activity.month - 1]} de {activity.year}</span>
                </div>
            </a>
        {/each}      
    </div>
    {:else}
     <div class="justify-self-center self-center justify-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
        bg-[#ffffff] gap-5 mx-20">
            {#each eventosFiltrados as activity}
                <a href={`/sessions/${activity.id}`} class="flex flex-col m-1 w-80 h-60 hover:scale-110 transition
                    duration-150 active:bg-blue-300 active:scale-95 bg-[#5a1d89] text-amber-50 hover:bg-black border-black border-2">
                    <div class="h-[60%] overflow-hidden">
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
    {/if}
<button id="scrollTop" onclick={backToTop} class="fixed flex top-[90%] left-[85%] px-4 py-2
             bg-black text-white text-2xl text-center opacity-90" hidden>^</button>
</div>