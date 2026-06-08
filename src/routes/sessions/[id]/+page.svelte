<script lang="ts">
    import { page } from '$app/stores';
    import '$lib/style.css';
    let { data } = $props();
    import { slide } from 'svelte/transition';
    import { draggable } from '@neodrag/svelte';
    import { createRawSnippet } from 'svelte';
    import { nonpassive } from 'svelte/legacy';
    import { onMount } from 'svelte';

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // svelte-ignore state_referenced_locally
    let info = $state(data);
    const rooms = info.room;
    const activityInfo = info.activities[0];
    const roomInfo = $state(info.room?.[0]);
    const couponsInfo = $state(info.coupons);
    const sessionsInfo = info.sessions;
    
    let time = $state(new Date(activityInfo.date_start));
    let hours = $derived(time.getHours());
    let minutes = $derived(time.getMinutes());
    let max_tickets = activityInfo.ticket_max_session
    
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

    let is_open = $state(false);
    let modal_open = $state(false);

    function toggleBuy() {
        is_open = !is_open;
        selected_seats = 0;
        storedSeats = {};

    }

    let increment = 1
    function zoom(id: string) {
        const grid = document.getElementById('grid'); 
            if (id === 'In') {
                increment += 0.3
                grid.style.zoom = increment;
            } else {
                increment -= 0.3
                grid.style.zoom = increment;
            } 
    }

    let a_colors: Record<string, string> = {}
    for (let i = 0; i < room.areas.length; i++) {
        a_colors[room.areas[i].id] = room.areas[i].color
    }

    let selected_seats: number= $state(0);
    let storedSeats: Record<string, string> = $state({});

    let orderAmount = $derived(roomInfo.amount * selected_seats);

    let galleryImages = []
    for (let i = 0; i < sessionsInfo?.length; i++) {
        if (sessionsInfo[i].type === 'gallery'){
            galleryImages.push(JSON.parse(sessionsInfo[i].url))
        };
    };
    
    let youtubeUrl = sessionsInfo[0].url_youtube;

    function getEmbedUrl(url: string) {
        if (youtubeUrl != null) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}`: null;
    } else {
        return null
    }
}
    let embedUrl = getEmbedUrl(youtubeUrl)
    console.log(youtubeUrl);
    console.log(embedUrl);


    function toggleSeat(id : string, areaid: string, label: string) {
        const element = document.getElementById(id);
        let seatsModal = document.getElementById('seatsModal') as HTMLDialogElement;
        if (element) {
            if (element.style.fill != 'green'){
                if (selected_seats < activityInfo.ticket_max_session) {
                    element.style.fill = 'green';
                    selected_seats += 1
                    storedSeats[label] = a_colors[areaid]; 
                    const seats = document.getElementById('seatContainer');
                    if (seats) {
                        let seat = document.createElement('div')
                        seat.id = `${label}`
                        seat.innerHTML = `<div class="flex justify-center items-center bg-[#5a1d89] rounded text-white"><svg id="${seat.id}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="fill: white; 
                        margin-right: 10px;" viewBox="0 0 256 256"> <path d="M240,132a28,28,0,0,1-24,27.71V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V159.71A28,28,0,1,1,72, 132v36a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,
                        0V132a28,28,0,0,1,56,0ZM44,88a44.06,44.06,0,0,1,43.81, 40h80.38A44.06,44.06,0,0,1,212,88a4,4,0,0,0,4-4V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V84A4,4,0,0,0,44,88Z"> 
                        </path></svg><span>${label}&nbsp;</span></div><span class="col-start-2 col-end-3 text-[10px] self-center">Toca para cancelar selección</span><span class="col-start-3 
                        justify-self-center self-center text-xl py-2">${roomInfo.amount}€</span>`
                        seat.className = "grid grid-cols-3 grid-rows-1 bg-purple-200 rounded-lg mx-10 text-xl m-2 gap-4 shadow-lg hover:opacity-60 hover:scale-105 active:scale-90 duration-300"
                        seat.onclick = () => {seats.removeChild(seat);
                                            element.style.fill = a_colors[areaid];
                                            selected_seats -= 1;
                                            delete storedSeats[label]};
                        seats.appendChild(seat)
                    }
                    if (a_colors[areaid] === '#1482f9'){
                            if (seatsModal.open) {
                                seatsModal.close();
                            } else {
                                seatsModal.showModal();
                            }
                    }
                }
            }else if (element.style.fill === 'green') {
                element.style.fill = a_colors[areaid];
                selected_seats -= 1
                delete storedSeats[label]
                const seats = document.getElementById('seatContainer');
                if (seats) {
                    let seat = document.getElementById(`${label}`)
                    if (seat) {
                        seats.removeChild(seat)
                    }
                }
            }
            if (selected_seats === activityInfo.ticket_max_session){
                const popUpEntradas = document.createElement('p');
                let container: HTMLElement | null = document.getElementById('container');
                if (container) {
                    popUpEntradas.textContent = `Has alcanzado el máximo de ${activityInfo.ticket_max_session} entradas por sesión.`;
                    popUpEntradas.className = 'fixed bg-red-500 bottom-[5%] w-[40%] left-[30%] lg:w-[10%] lg:left-[45%] text-white p-2 rounded-lg';
                    container?.appendChild(popUpEntradas);
                    setTimeout(() => {
                        fadeOut(popUpEntradas, 2000);
                    }, 1000);
                    setTimeout(() => {
                        container?.removeChild(popUpEntradas);
                        }, 3000);
                        return;
                }
            }
            if (selected_seats === activityInfo.ticket_max_session){
                const popUpEntradas = document.createElement('p');
                let container: HTMLElement | null = document.getElementById('container');
                if (container) {
                    popUpEntradas.textContent = `Has alcanzado el máximo de ${activityInfo.ticket_max_session} entradas por sesión.`;
                    popUpEntradas.className = 'fixed bg-red-500 bottom-[5%] w-[40%] left-[30%] lg:w-[10%] lg:left-[45%] text-white p-2 rounded-lg';
                    container?.appendChild(popUpEntradas);
                    setTimeout(() => {
                        fadeOut(popUpEntradas, 2000);
                    }, 1000);
                    setTimeout(() => {
                        container?.removeChild(popUpEntradas);
                        }, 3000);
                    
                };
            };
        };
    };

    function fadeOut(element: HTMLElement, duration: number = 3000){
        const animation = element.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: duration,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            element.style.opacity = 'none';
        }
    }

   
    function toggleModal() {
        const modal = document.getElementById('modal') as HTMLDialogElement;
        let form = document.getElementById('form') as HTMLFormElement;
        let formButton = document.getElementById('formButton') as HTMLInputElement; 
        if (modal) {
            if (modal.open) {
                modal_open = false;
                modal.close();
                form.reset();
                formButton.disabled = true;
            } else {
                modal_open = true;
                modal.showModal();
                form.reset();
                formButton.disabled = true;
            }
        }
    }

    function setBuy() {
        let formButton = document.getElementById('formButton') as HTMLInputElement;
        if (formButton.disabled === true) {
        formButton.disabled = false;
        } else {
            formButton.disabled = true;
        }
    }

    let usedCoupons: Array<string> = []
    function applyCoupon() {
        let couponInput = document.getElementById('couponInput') as HTMLInputElement;
        let couponValue = couponInput.value;
        for (let i = 0; i < couponsInfo.length; i++){
            let row = couponsInfo[i];
            if (row.code.toUpperCase() == couponValue.toUpperCase()) {
                console.log('Cupón validado')
                 if (row.type === 'percent' && !usedCoupons.includes(row.code)) {
                    orderAmount = orderAmount * ((100 - row.discount) / 100)
                    usedCoupons.push(row.code)
                    break
                } else if (row.type === 'amount' && !usedCoupons.includes(row.code)){
                    orderAmount -= row.discount
                    usedCoupons.push(row.code)
                    break
                }
            }
        }
    }

    
    

    function hola() {
        console.log('hola');
    }

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
    <dialog id="seatsModal" class="w-100 rounded-lg p-5 mx-auto my-auto">
        <div class="flex justify-center items-center">
            <svg class="mx-2"height="20" width="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 59.617 59.617" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <circle style="fill:#030104;" cx="22.317" cy="4.971" r="4.971"></circle> <path style="fill:#030104;" d="M42.432,45.669c-0.959-0.457-2.107-0.054-2.566,0.906c-2.67,5.585-8.395,9.192-14.582,9.192 c-8.907,0-16.155-7.246-16.155-16.154c0-5.057,2.303-9.729,6.319-12.816c0.843-0.648,1.001-1.856,0.354-2.698 c-0.649-0.844-1.856-1-2.698-0.354c-4.97,3.822-7.822,9.606-7.822,15.868c0,11.029,8.973,20.004,20.003,20.004 c7.659,0,14.747-4.469,18.053-11.381C43.795,47.275,43.389,46.128,42.432,45.669z"></path> <path style="fill:#030104;" d="M54.018,47.154L43.654,30.527c-0.495-0.795-1.475-0.982-2.518-0.944H28.089 c-0.53,0-0.959-0.056-0.956-0.123l0.007-0.123v-2.118c0-0.531,0.085-0.946,0.192-0.935c0.064,0.007,0.13,0.012,0.195,0.012h11.385 c1.283,0,2.324-1.041,2.324-2.325c0-1.283-1.041-2.324-2.324-2.324H27.527c-0.065,0-0.131,0.004-0.195,0.011 c-0.107,0.013-0.192-0.402-0.192-0.934v-5.437c0-2.067-1.676-3.742-3.742-3.742h-1.039c-2.068,0-3.743,1.675-3.743,3.742V29.82 v4.278c0,2.066,1.675,3.742,3.743,3.742h1.039h1.806H40.27c0.531,0,1.198,0.359,1.491,0.803 c1.802,2.723,7.569,11.434,7.569,11.434c0.695,1.117,2.312,1.371,3.607,0.564C54.23,49.834,54.713,48.273,54.018,47.154z"></path> </g> </g> </g></svg>
            <p class="font-bold text-2xl">Información importante</p>
        </div>
        <div class="flex justify-center items-center mt-5 flex-col"><p class="text-center">Aviso: Este espacio es solo para personas con movilidad reducida, no existe asiento físico.</p><br>
            <p class="text-center">Note: This space is only for people with reduced mobility, there is no physical seat.</p>
            <button onclick={() => {let seatsModal = document.getElementById('seatsModal') as HTMLDialogElement; seatsModal.close();}} 
            class="bg-[#5a1d89] hover:bg-[#7d3ead] active:scale-90 hover:scale-110 duration-300 text-white px-5 py-2 m-5 mb-0 rounded-lg">Entendido</button></div>
    </dialog>
    <dialog id="modal" class="md:w-[40%] lg:w-[30%] rounded-lg p-5 mx-auto my-auto">
        <div class="grid grid-cols-[70%_30%] mb-5">
            <p class="text-2xl font-bold">Tickets</p>
            <button class="text-2xl font-bold w-10 h-10
                bg-gray-300 border-2 border-gray-400 rounded-full shadow-2xl flex justify-center content-center active:scale-90 hover:scale-110 duration-300 justify-self-end" onclick="{toggleModal}">x</button>
        </div>
        <div class="grid grid-cols-[15%_70%_15%]">
        {#if modal_open}
            {#each Object.entries(storedSeats) as [label, color]}
                <div class="flex items-center mb-2">
                    <p class="font-bold">{label}</p>
                </div>
                <div class="grow h-px bg-slate-500 flex self-center mb-2">
                </div>
                <div class="flex items-center justify-self-end">
                    <p style="background-color: {color};" class="text-[#ffffff] font-bold px-2 py-1 rounded-lg mb-2">{roomInfo?.amount}€</p>
                </div>
            {/each}
        {/if}
        </div>
        <div class="grid grid-cols-[90%_10%] bg-gray-700 text-white p-2">
            <div>
                <p class="font-bold">Total:</p>
            </div>
            <div>
                <p class="font-bold justify-self-end">{roomInfo?.amount * selected_seats}€</p>
            </div>
        </div>
         <div class="mb-5">
            <p class="text-2xl font-bold mt-2">Datos del comprador/a</p>
         </div>
         <div>
            <form id="form">
                <label for="name">Nombre <span class="text-red-500">*</span></label><br>
                <input type="text" id="name" name="name" required class="w-full bg-gray-200 py-2 px-3 mb-3" placeholder="Escribe aquí tu nombre"><br>
                <label for="email">Email <span class="text-red-500">*</span></label><br>
                <input type="email" id="email" name="email" required class="w-full bg-gray-200 py-2 px-3 mb-3" placeholder="Escribe aquí tu email"><br>
                <label for="telefono">Teléfono <span class="text-red-500">*</span></label><br>
                <input type="text" id="telefono" name="telefono" required class="w-full bg-gray-200 py-2 px-3 mb-3" placeholder="Escribe aquí tu telefono"><br>
                <label for="newsletter"><input type="checkbox" id="newsletter" name="newsletter"/>Acepto recibir información de novedades y eventos</label><br>
                <label for="privacidad"><input type="checkbox" id="privacidad" name="privacidad" required onclick={() => setBuy()}/><span class="text-red-500">*</span>He leído y acepto los Términos y condiciones y 
                    <a href="https://sede.losrealejos.es/castellano/eMiservicio/9031892218D846E3A343E37F026841D4.asp" target="_blank" class="text-blue-500 hover:underline">Política de privacidad</a></label><br>
                <input id="formButton" type="submit" value="Comprar" disabled class=" flex justify-self-center my-6 px-4 py-3 rounded-lg text-white bg-[#5a1d89] hover:bg-[#7d3ead] disabled:bg-gray-400 disabled:text-gray-700"/>
            </form>
         </div>

    </dialog>

<div class="flex flex-col justfiy-center  items-center m-0 p-0 box-border w-screen">
    <div id="background" class="fixed z-10 top-0 left-0 w-full h-full overflow-hidden">
        <img src='{activityImg}' alt="Fondo" class="w-full h-full object-cover block blur scale-110"/>
    </div>

    <div id="container" class="w-screen 2xl:w-[40%] bg-[#fbfbfb] rounded-lg relative mr-5 ml-5 justify-center z-20 p-right-5 p-left-5">
        <div id="cabecera" class="w-full h-full 2xl:w-full flex justify-center items-center">
            <img src='{activityImg}' alt='Portada de "El postre"' class= " w-fit rounded-[1mm]"/>
        </div>

        <div id="titulo" class="grid grid-cols-[60%_40%] max-2xl:grid-cols-1 items-center justify-center mr-2 ml-2 mt-2 lg:bg-gray-200 lg:rounded-lg" >
            <div id="titulo_info" class="justify-around conten-center p-4 bg-gray-200 rounded-lg gap-5 mb-2">
                <h1 class="text-l font-bold">{activityInfo.day} de {months[activityInfo.month - 1]}</h1>
                <p class="text-opacity-60 text-black text-[14px] content-center self-end italic"
                id="ubicacion">{activityInfo.places_name}</p>
                <h1 class="text-3xl font-bold mt-1 mb-1">{activityInfo.activity_name}</h1>
                <div id="ubiprecio" class="grid grid-cols-[1fr] gap-5">
                    {#if roomInfo.amount === 0}
                        <b class="text-xl font-normal">Gratuito</b>
                    {:else}
                        <b class="text-xl font-normal">{roomInfo?.amount}€</b>
                    {/if}
                </div>
            </div>
            <div id="buttonBox" class="flex items-center content-center justify-center p-4">
                <button
                    class="bg-[#5a1d89] hover:bg-[#7d3ead] active:scale-90 hover:scale-110 duration-300 lg:hover:underline  text-white text-[20px] font-bold py-3 px-12 margin-right-[5px] rounded-lg"
                    id="entradas"
                    bind:this={boton}
                onclick={toggleBuy}>
                    Entradas
                </button>
            </div>
        </div>
        <hr class="m-2 ml-5 mr-5 opacity-30"/>
        {#if is_open}
            <div  transition:slide={{ duration: 300}}>
            <div class="flex justify-center overflow-hidden relative m-10 border border-gray-400 shadow-2xl rounded-lg">
            <button class="text-2xl font-bold absolute top-12.5 right-8 z-10 w-10 h-10
            bg-gray-300 border-2 border-gray-400 rounded-full shadow-2xl flex justify-center content-center active:scale-90 hover:scale-110 duration-300" onmousedown={() => zoom('In')}>+</button>
            <button class="text-2xl font-bold absolute top-25 right-8 z-10 w-10 h-10
            bg-gray-300 border-2 border-gray-400 rounded-full shadow-2xl flex justify-center content-center active:scale-90 hover:scale-110 duration-300" onmousedown={() => zoom('Out')}>-</button>
                <div id="grid" style="background-image: url('{roomImg}'); grid-template-columns: repeat({columns}, 13px); grid-template-rows: repeat({rows}, 13px);" class="grid h-auto bg-contain bg-no-repeat bg-center origin-[0,0] will-change-transform" use:draggable={{ axis: 'both' }}>
                {#each grid_info as row}
                    {#each row as seat}
                        {#if seat.type === 'seat'}
                            {#if seat.areaId in a_colors}
                                <button aria-label="none" onclick={() => toggleSeat(`${seat.id}`,`${seat.areaId}`,`${seat.label}`)}
                                class="row-start-{seat.x} col-start-{seat.y} 
                                rounded-full flex justify-center items-center hover:opacity-60 active:scale-90 hover:scale-110 duration-100"><svg id="{seat.id}"
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="fill: {a_colors[seat.areaId]};" viewBox="0 0 256 256">
                                <path d="M240,132a28,28,0,0,1-24,27.71V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V159.71A28,28,0,1,1,72,
                                132v36a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V132a28,28,0,0,1,56,0ZM44,88a44.06,44.06,0,0,1,43.81,
                                40h80.38A44.06,44.06,0,0,1,212,88a4,4,0,0,0,4-4V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V84A4,4,0,0,0,44,88Z">
                                </path></svg></button>
                            {/if}
                        {:else}
                            <button aria-label="none"></button>
                        {/if}
                    {/each}
                {/each}
                </div>
                <div class="absolute bottom-10 left-0 mx-5 flex lg:flex-col gap-2">
                    {#each room.areas as area}
                        <div class="px-2 py-1 rounded-lg text-[#f6f6f6]  flex items-center" style="background-color: {area.color};">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="fill: #f6f6f6;" viewBox="0 0 256 256" class="flex float-left mx-1 self-center"><path d="M240,132a28,28,0,0,1-24,27.71V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V159.71A28,28,0,1,1,72,
                                132v36a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V132a28,28,0,0,1,56,0ZM44,88a44.06,44.06,0,0,1,43.81,
                                40h80.38A44.06,44.06,0,0,1,212,88a4,4,0,0,0,4-4V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V84A4,4,0,0,0,44,88Z">
                                </path></svg>
                            <p class="text-shadow-2xs float-left self-center text-[10px] lg:text-[14px] font-bold">{area.label} {roomInfo?.amount}€</p>
                            
                        </div>
                    {/each}
                </div>
            </div>
            <div id="seatContainer">
            
            </div>
            {#if selected_seats}
                <form id="couponForm" method="get" transition:slide={{ duration: 500 }} target="_self" >
                    <div id="couponContainer" class="grid grid-cols-[70%_30%] bg-gray-700  mx-10 rounded-lg rounded-l-xl text-white">
                        <input id="couponInput" type="text" placeholder="Introduce tu código de descuento" name="couponInput" class="h-full w-full p-3 bg-gray-100 text-black rounded-l-lg border border-gray-400">
                        <button id="couponButton" type ="button" class="p-5 w-full h-full hover:bg-gray-600 hover:underline rounded-r-lg text-lg font-bold" onclick={() => applyCoupon()}>Añadir</button>
                    </div>
                </form>
            {/if}
            <div class="mx-10 my-3  rounded-[3mm] p-5 grid grid-cols-2 gap-4 bg-purple-200">
                {#if roomInfo.amount === 0}
                            <b class="text-2xl font-normal self-center">Gratuito</b>
                        {:else}
                            <b class="text-2xl font-normal self-center">Total: {orderAmount}€</b>
                        {/if}
                        {#if selected_seats === 0}
                            <button id="buyButton" class="bg-gray-400 
                text-white text-[15px] font-bold py-3 px-8 rounded-lg justify-self-center" disabled onclick={() => hola()}>Comprar</button>
                        {:else}
                            <button id="buyButton" class="bg-[#5a1d89] hover:bg-[#7d3ead] active:scale-90 hover:scale-110 duration-300 
                lg:hover:underline  text-white text-[15px] font-bold py-3 
                px-8 rounded-lg justify-self-center" onclick={() => toggleModal()}>Comprar</button>
                        {/if}
            </div>
            <div class="absolute bottom-1 left-0">
                {#each room.label as label}
                    <p>{label}</p>
                {/each}
            </div>
        </div>
        {/if}

        <div class="flex flex-col 2xl:grid 2xl:grid-cols-[70%_30%] max-w-225 mx-auto">
        <div class="ml-5 mr-5 p-4 **:font-sans!" >
            <div>{@html activityInfo.description}</div>
            {#if galleryImages.length > 0}
            <div id="gallery">

            </div>
            {/if}
            {#if youtubeUrl != null}
            <div class="w-full">
                <iframe src='{embedUrl}' width="100%" height="400" title="video"></iframe>
            </div>
            {/if}
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