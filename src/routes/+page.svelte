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

    const activityInfo = data.activities[0]

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
            <h1 class="texto">21 de mayo</h1>
            <h1 class="texto">El postre - del Taller de Interpretación ante la Cámara</h1>
            <div id="ubiprecio">
                <a
                    class="texto"
                    id="ubicacion"
                    bind:this={ubi}
                    href="https://duckduckgo.com/?q=teatro+cine+los+realejos&iaxm=maps&source=placesy"
                    onmouseenter={animacion_ubi}
                    onmouseleave={animacion_ubi}
                >
                    Teatro Cine Realejos, Los Realejos
                </a>
                <b class="texto" id="precio">Gratuito</b>
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
            <p>Jueves, 21 de mayo de 2026, 20:30</p>
            <hr />

            <div class="data">
                <img class="icon" src="/map-pin.png" alt="Icono lugar" />
                <h4>Lugar</h4>
            </div>
            <p>Teatro Cine Realejos</p>
            <hr />

            <div class="data">
                <img class="icon" src="/users-three.png" alt="Icono clasificación" />
                <h4>Clasificación</h4>
            </div>
            <p>Todos los públicos</p>
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