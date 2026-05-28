<script lang="ts">
    import type { ActivityInfo } from '$lib/model';
    import type { RoomConfig } from '$lib/model/room_config.model.js';
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { data } = $props();
    import { slide } from 'svelte/transition';




    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // svelte-ignore state_referenced_locally
    let info = $state(data);
    const activityInfo = info.activities[0];
    const roomInfo = $state(info.room?.[0]);
    let time = $state(new Date(activityInfo.date_start));
    let hours = $derived(time.getHours());
    let minutes = $derived(time.getMinutes());

    let activityUrl = JSON.parse(activityInfo.url || '{}');
    let activityImg = $derived(`${import.meta.env.VITE_TICKETARY_API}${activityUrl['big']}`);

    let roomUrl = JSON.parse(roomInfo?.room_map || '{}');
    let roomImg = $derived((`${import.meta.env.VITE_TICKETARY_API}${roomUrl['big']}`));

    let map_info = JSON.parse(roomInfo?.map_info || '{}');
    let room = map_info['_room']
    let rows = room['rows']
    let columns = room['columns']

        function Range(end: number, start: number = 1) {
            let values = [];
            for (let i = start; i <= end; i++) {
                values.push(i);
            }
            return values;
        }

    let row_list = Range(rows)
    let column_list = Range(columns)

    let grid_info = room['grid']


    let boton: HTMLButtonElement | null = null;

    function toggleSeat(id : string) {
        const element = document.getElementById(id);
        if (element) {
            if (element.style.fill === 'black') {
                element.style.fill = 'green';
            } else {
                element.style.fill = 'black';
            }
        }
    };

    let is_open = $state(false);

    function toggleBuy() {
        is_open = !is_open;
    }
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="flex flex-col justfiy-center  items-center m-0 p-0 box-border w-screen">
    <div id="background" class="fixed z-10 top-0 left-0 w-full h-full overflow-hidden">
        <img src='{activityImg}' alt="Fondo" class="w-full h-full object-cover block blur scale-110"/>
    </div>

    <div id="container" class="w-screen 2xl:w-[40%] bg-[#fbfbfb] rounded-lg relative mr-5 ml-5 justify-center z-20 p-right-5 p-left-5">
        <div id="cabecera" class="w-full h-full 2xl:w-full flex justify-center items-center">
            <img src='{activityImg}' alt='Portada de "El postre"' class = " w-fit rounded-[1mm]"/>
        </div>

        <div id="titulo" class="grid grid-cols-[60%_40%] max-2xl:grid-cols-1 items-center justify-center mr-2 ml-2 mt-2 lg:bg-gray-200 lg:rounded-lg" >
            <div id="titulo_info" class="justify-around conten-center p-4 bg-gray-200 rounded-lg gap-5 mb-2">
                <h1 class="text-l font-bold">{activityInfo.day} de {months[activityInfo.month - 1]}</h1>
                <p
                        class="text-opacity-60 text-black text-[14px] content-center self-end italic"
                        id="ubicacion"
                    >
                        {activityInfo.places_name}
            </p>
                <h1 class="text-3xl font-bold mt-1 mb-1">{activityInfo.activity_name}</h1>
                <div id="ubiprecio" class="grid grid-cols-[1fr] gap-5">
                    {#if activityInfo.amount === 0}
                        <b class="text-xl font-normal">Gratuito</b>
                    {:else}
                        <b class="text-xl font-normal">{roomInfo?.amount}€</b>
                    {/if}
                </div>
            </div>
            <div id="buttonBox" class="flex items-center content-center justify-center p-4">
                <button
                    class="bg-[#5a1d89] hover:bg-[#7d3ead] active:scale-115 duration-300 lg:hover:underline  text-white text-[20px] font-bold py-3 px-12 margin-right-[5px] rounded-lg"
                    id="entradas"
                    bind:this={boton}
                onclick={toggleBuy}>
                    Entradas
                </button>
            </div>
        </div>
        <hr class="m-2 ml-5 mr-5 opacity-30"/>
        {#if is_open}
        <div class="flex justify-center max-w-600px h-auto" transition:slide={{ duration: 300}}>
            <div style="background-image: url('{roomImg}'); grid-template-columns: repeat({columns}, 20px); grid-template-rows: repeat({rows}, 20px);" class="grid h-auto bg-contain bg-no-repeat bg-center max-w-300">
            {#each grid_info as row}
                {#each row as seat}
                    {#if seat.type === 'seat'}
                        <button aria-label="none" onclick={() => toggleSeat(`${seat.x}${seat.y}`)} class="row-start-{seat.x} col-start-{seat.y} 
                        rounded-full flex justify-center items-center hover:opacity-60 active:scale-110" ><svg id="{seat.x}{seat.y}" class="hover:fill-amber-200∫" 
                        xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="fill: black;" viewBox="0 0 256 256">
                        <path d="M240,132a28,28,0,0,1-24,27.71V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V159.71A28,28,0,1,1,72,
                        132v36a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V132a28,28,0,0,1,56,0ZM44,88a44.06,44.06,0,0,1,43.81,
                        40h80.38A44.06,44.06,0,0,1,212,88a4,4,0,0,0,4-4V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V84A4,4,0,0,0,44,88Z">
                        </path></svg></button>
                    {:else}
                        <button aria-label="none"></button>
                    {/if}
                {/each}
            {/each}
            </div>
        </div>
        {/if}
        <div class="flex flex-col 2xl:grid 2xl:grid-cols-[70%_30%] max-w-225 mx-auto">
        <div class="ml-5 mr-5 p-4 **:font-sans!" >
            <div>{@html activityInfo.description}</div>
        </div>

        <div class="ml-5 mr-5 2xl:margin-right-[20px] 2xl:w-[75%] 2xl:col-start-2 p-2" id="data">
            <div class="margin-right-[10px] mt-2 flex ">
                <img class="w-8 h-8 mr-1 icon float-left self-center" src="/calendar-dots.png" alt="Icono calendario" />
                <h4 class="text-[16px] font-bold self-center">Fecha y Hora</h4>
            </div>
            <p>{days[activityInfo.dow - 1]}, {activityInfo.day} de {months[activityInfo.month -1]} de {activityInfo.year}, {hours}:{minutes ? minutes : '00'}</p>
            <hr class="mt-1"/>

            <div class="margin-right-[10px] mt-2 flex ">
                <img class="w-8 h-8 mr-1 icon self-center" src="/map-pin.png" alt="Icono lugar" />
                <h4 class="text-[16px] font-bold float-left self-center">Lugar</h4>
            </div>
            <p>{activityInfo.places_name}</p>
            <hr class="mt-1" />

            <div class="margin-right-[10px] mt-2 flex">
                <img class="w-8 h-8 mr-1 icon self-center" src="/users-three.png" alt="Icono clasificación" />
                <h4 class="text-[16px] font-bold float-left self-center"   >Clasificación</h4>
            </div>
            <p>{activityInfo.public_name}</p>
            <hr class="mt-1" />

            <div class="margin-right-[10px] mt-2 flex">
                <img class="w-8 h-8 mr-1 icon self-center" src="/file-text.png" alt="Icono reembolso" />
                <h4 class="text-[16px] font-bold float-left self-center">Políticas de reembolso</h4>
            </div>
            <p>
                Contacta vía teléfono al 922 346 234
                <br />
                De lunes a viernes de 9:00 a 14:00 horas
                <br />
                Avenida de Canarias, 6 CP38419, Los Realejos
            </p>
            <hr class="mt-1" />
        </div>
        </div>
    </div>
</div>