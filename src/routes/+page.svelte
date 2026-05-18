<script lang="ts">
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { children } = $props();

    type Activity = Record<string, any>;

    const data = $page.data as {
        activities: Activity[];
        error: string | null;
    };

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    

    const activityInfo = data.activities[0];
    let time = $state(new Date(activityInfo.date_start));
    let hours = $derived(time.getHours());
    let minutes = $derived(time.getMinutes());

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

<div id="background">
    <img src="/foto.jpg" alt="Fondo" />
</div>

<div id="container">
    <div id="cabecera">
        <img src="/foto.jpg" alt='Portada de "El postre"' />
    </div>

    <div id="titulo">
        <div id="titulo_info">
            <h1 class="texto">{activityInfo.day} de {months[activityInfo.month - 1]}</h1>
            <h1 class="texto">{activityInfo.activity_name}</h1>
            <div id="ubiprecio">
                <a
                    class="texto"
                    id="ubicacion"
                    bind:this={ubi}
                    href="https://duckduckgo.com/?q=teatro+cine+los+realejos&iaxm=maps&source=placesy"
                    onmouseenter={animacion_ubi}
                    onmouseleave={animacion_ubi}
                >
                    {activityInfo.name}
                </a>
                {#if activityInfo.amount === 0}
                    <b class="texto" id="precio">Gratuito</b>
                {:else}
                    <b class="texto" id="precio">{activityInfo.amount}€</b>
                {/if}
            </div>
        </div>
        <div id="buttonBox">
            <button
                class="texto"
                id="entradas"
                bind:this={boton}
                onmouseleave={animacion_boton}
                onmouseenter={animacion_boton}
            >
                Entradas
            </button>
        </div>
    </div>

    <div id="info">
        <div id="sinopsis">
            <div>{@html activityInfo.description}</div>
        </div>

        <div id="data">
            <div class="data">
                <img class="icon" src="/calendar-dots.png" alt="Icono calendario" />
                <h4>Fecha y Hora</h4>
            </div>
            <p>{days[activityInfo.dow - 1]}, {activityInfo.day} de {months[activityInfo.month -1]} de {activityInfo.year}, {hours}:{minutes}</p>
            <hr />

            <div class="data">
                <img class="icon" src="/map-pin.png" alt="Icono lugar" />
                <h4>Lugar</h4>
            </div>
            <p>{activityInfo.name}</p>
            <hr />

            <div class="data">
                <img class="icon" src="/users-three.png" alt="Icono clasificación" />
                <h4>Clasificación</h4>
            </div>
            <p>{activityInfo.public_name}</p>
            <hr />

            <div class="data">
                <img class="icon" src="/file-text.png" alt="Icono reembolso" />
                <h4>Políticas de reembolso</h4>
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

<style>
    @import '$lib/style.css';
</style>