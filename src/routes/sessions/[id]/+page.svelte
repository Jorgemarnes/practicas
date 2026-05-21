<script lang="ts">
    import type { ActivityInfo } from '$lib/model';
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { data } = $props();



    const info = $page.data as {
        activities: ActivityInfo[];
        error: string | null;
    };

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    

    const activityInfo = info.activities[0];
    let time = $state(new Date(activityInfo.date_start));
    let hours = $derived(time.getHours());
    let minutes = $derived(time.getMinutes());

    let imgUrl = JSON.parse(activityInfo.url);
    let img = $derived((`${import.meta.env.VITE_TICKETARY_API}${imgUrl['big']}`));

    let boton: HTMLButtonElement | null = null;
    let ubi: HTMLAnchorElement | null = null;
    let button_state = false;
    let ubi_state = false;


    function animacion_boton() {
        if (!boton) return;

        if (!button_state) {
            boton.style.backgroundColor = 'rgb(199, 91, 91)';
            button_state = true;
        } else {
            boton.style.backgroundColor = 'rgb(183, 52, 52)';
            button_state = false;
        }
    }

    function animacion_ubi() {
        if (!ubi) return;

        if (!ubi_state) {
            ubi.style.color = 'blue';
            ubi_state = true;
        } else {
            ubi.style.color = 'black';
            ubi_state = false;
        }
    }

    
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<div class="flex flex-col justfiy-center  items-center m-0 p-0 box-border w-screen">
    <div id="background" class="fixed z-10 top-0 left-0 w-full h-full overflow-hidden">
        <img src='{img}' alt="Fondo" class="w-full h-full object-cover block blur scale-110"/>
    </div>

    <div id="container" class="w-screen 2xl:w-[40%] bg-[#fbfbfb] rounded-[3mm] relative m-[0_auto] justify-center z-20 p-right-5 p-left-5">
        <div id="cabecera" class="w-full 2xl:w-full flex justify-center items-center">
            <img src='{img}' alt='Portada de "El postre"' class = "w-full 2xl:w-[50%] rounded-[1mm]"/>
        </div>

        <div id="titulo" class="grid grid-cols-[60%_40%] max-2xl:grid-cols-1 items-center justify-center bg-[#fbfbfb] rounded-[5mm] rounded-tl-none rounded-tr-none gap-5">
            <div id="titulo_info" class="ml-5 justify-around conten-center p-4">
                <h1 class="text-xl font-bold">{activityInfo.day} de {months[activityInfo.month - 1]}</h1>
                <h1 class="text-2xl font-bold">{activityInfo.activity_name}</h1>
                <div id="ubiprecio" class="grid grid-cols-[50fr_50fr] gap-5">
                    <a
                        class="text-opacity-60 text-black text-[22px] content-center"
                        id="ubicacion"
                        bind:this={ubi}
                        href="https://duckduckgo.com/?q=teatro+cine+los+realejos&iaxm=maps&source=placesy"
                        onmouseenter={animacion_ubi}
                        onmouseleave={animacion_ubi}
                    >
                        {activityInfo.places_name}
                    </a>
                    {#if activityInfo.amount === 0}
                        <b class="text-2xl m-[0_auto] content-center">Gratuito</b>
                    {:else}
                        <b class="text-2xl m-[0_auto]">{activityInfo.amount}€</b>
                    {/if}
                </div>
            </div>
            <div id="buttonBox" class="flex items-center content-center justify-center p-4">
                <button
                    class="bg-[#b73434] hover:bg-[#c75b5b]  text-white text-[20px] font-bold py-3 px-12 margin-right-[5px] rounded"
                    id="entradas"
                    bind:this={boton}
                >
                    Entradas
                </button>
            </div>
        </div>

        <div class="flex flex-col 2xl:grid 2xl:grid-cols-[70%_30%] gap-10 max-w-225 mx-auto">
        <div class="margin-left-[20px] p-4" >
            <div>{@html activityInfo.description}</div>
        </div>

        <div class="margin-right-[60px_0] 2xl:margin-right-[20px] 2xl:w-[75%] 2xl:col-start-2 p-2" id="data">
            <div class="margin-right-[10px] flex">
                <img class="w-5 h-5 margin-right-[0.5em] icon float-left" src="/calendar-dots.png" alt="Icono calendario" />
                <h4 class="text-[16px] font-bold">Fecha y Hora</h4>
            </div>
            <p>{days[activityInfo.dow - 1]}, {activityInfo.day} de {months[activityInfo.month -1]} de {activityInfo.year}, {hours}:{minutes}</p>
            <hr />

            <div class="margin-right-[10px] flex">
                <img class="w-5 h-5 margin-right-[0.5em] icon" src="/map-pin.png" alt="Icono lugar" />
                <h4 class="text-[16px] font-bold float-left">Lugar</h4>
            </div>
            <p>{activityInfo.places_name}</p>
            <hr />

            <div class="margin-right-[10px] flex">
                <img class="w-5 h-5 margin-right-[0.5em] icon" src="/users-three.png" alt="Icono clasificación" />
                <h4 class="text-[16px] font-bold float-left"   >Clasificación</h4>
            </div>
            <p>{activityInfo.public_name}</p>
            <hr />

            <div class="margin-right-[10px] flex">
                <img class="w-5 h-5 margin-right-[0.5em] icon" src="/file-text.png" alt="Icono reembolso" />
                <h4 class="text-[16px] font-bold float-left">Políticas de reembolso</h4>
            </div>
            <p>
                Contacta vía teléfono al 922 346 234
                <br />
                De lunes a viernes de 9:00 a 14:00 horas
                <br />
                Avenida de Canarias, 6 CP38419, Los Realejos
            </p>
            <hr />
        </div>
        </div>
    </div>
</div>