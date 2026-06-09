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
        activeCouponCode = '';

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
    let activeCouponCode = $state('');

    let discountAmount = $derived((() => {
        const coupon = couponsInfo.find((item) => item.code.toUpperCase() === activeCouponCode.toUpperCase());
        if (!coupon) return 0;

        const base = roomInfo.amount * selected_seats;
        if (coupon.type === 'percent') {
            return base * (coupon.discount / 100);
        }

        return Math.min(coupon.discount, base);
    })());

    let orderAmount = $derived(roomInfo.amount * selected_seats - discountAmount);

    let galleryImages = []
    for (let i = 0; i < (sessionsInfo?.length ?? 0); i++) {
        if (sessionsInfo?.[i]?.type === 'gallery') {
            let imageurl = JSON.parse(sessionsInfo[i].url)
            galleryImages.push(`${import.meta.env.VITE_TICKETARY_API}${imageurl['medium']}`)
        }
    }

    const videoSession = sessionsInfo?.find((session) => Boolean(session?.url_youtube)) ?? null;
    let youtubeUrl = videoSession?.url_youtube ?? '';

    function getEmbedUrl(url: string = '') {
        if (!url) return null;

        if (url.includes('youtu')) {
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
            return match ? `https://www.youtube.com/embed/${match[1]}` : null;
        }

        else if (url.includes('instagram')) {
            const match = url.match(/https:\/\/www\.instagram\.com\/(reel|p)\/([\w-]+)/i);
            return match ? `${match[1]}/${match[2]}` : null;
        }

        return null;
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

    function applyCoupon() {
        const couponInput = document.getElementById('couponInput') as HTMLInputElement | null;
        if (!couponInput) return;

        const couponValue = couponInput.value.trim().toUpperCase();
        const matchedCoupon = couponsInfo.find((row) => row.code.toUpperCase() === couponValue);

        if (!matchedCoupon) return;

        activeCouponCode = matchedCoupon.code;
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
                <p class="font-bold justify-self-end">{orderAmount}€</p>
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
            <div class="not-prose overflow-auto rounded-lg">
            <div id="gallery" class="flex w-full snap-x gap-1 scroll-auto overflow-x-auto py-14">
                {#each galleryImages as image}
                <div class="snap-start scroll-ml-6 relative shrink-0 h-70 w-auto">
                    <img src={image} alt="a" class="h-full"/>
                </div>
                {/each}
            </div>
            </div>
            {/if}
            {#if youtubeUrl && youtubeUrl.includes('youtu')}
                <div class="w-full">
                    <iframe src='{embedUrl}' width="100%" height="400" title="video"></iframe>
                </div>
            {:else if youtubeUrl && youtubeUrl.includes('instagram')}
                <div class="w-full">
                    <blockquote
                        class="instagram-media"
                        data-instgrm-captioned
                        data-instgrm-permalink={`https://www.instagram.com/${embedUrl}/?utm_source=ig_embed&amp;utm_campaign=loading`}
                        data-instgrm-version="14"
                        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
                    >
                        <div style="padding:16px;">
                            <a href={`https://www.instagram.com/${embedUrl}/?utm_source=ig_embed&amp;utm_campaign=loading`} style=" background:#FFFFFF; line-height:0; padding:0 0; 
                            text-align:center; text-decoration:none; width:100%;" target="_blank"><div style=" display: flex; flex-direction: row; align-items: center;"> 
                                <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> 
                                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> 
                                    <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> 
                                    <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                                </div>
                            </div>
                            <div style="padding: 19% 0;"></div> 
                            <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000">
                                        <g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 
                                        560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 
                                        535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 
                                        524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 
                                        C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 
                                        556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 
                                        523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 
                                        C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 
                                        518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 
                                        541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.
                                        154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 
                                        565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 
                                        560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 
                                        523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 
                                        11.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 
                                        514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 
                                        541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 
                                        C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 
                                        570.82,37.631"></path></g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div style="padding-top: 8px;">
                                 <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">Ver esta publicación en Instagram</div>
                            </div>
                            <div style="padding: 12.5% 0;"></div> 
                            <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
                                <div> 
                                    <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
                                    <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; 
                                    margin-right: 14px; margin-left: 2px;"></div>
                                    <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px)
                                     translateY(-18px);"></div>
                                </div>
                                <div style="margin-left: 8px;">
                                    <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div>
                                    <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; 
                                    transform: translateX(16px) translateY(-4px) rotate(30deg)"></div>
                                </div>
                                <div style="margin-left: auto;"> 
                                    <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> 
                                    <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> 
                                    <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div>
                                </div>
                            </div> 
                            <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> 
                                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> 
                                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div>
                            </div>
                        </a>
                        </div>
                    </blockquote>
<script async src="//www.instagram.com/embed.js"></script>
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
                {@html activityInfo.refund_text}
            </p>
            <hr class="mt-1" />
        </div>
        </div>
    </div>
    </div>