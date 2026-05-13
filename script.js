let boton = document.getElementById("entradas")
        let ubi = document.getElementById("ubicacion")
        button_state = false
        ubi_state = false
        function animacion_boton() {
            if (!button_state) {
                boton.style.backgroundColor = "rgb(199, 91, 91)"
                button_state = true
            }
            else {
                boton.style.backgroundColor = "rgb(183, 52, 52)"
                button_state = false
            }
        }
        function animacion_ubi() {
            if (!ubi_state) {
                ubi.style.color = "blue"
                ubi_state = true
            }
            else {
                ubi.style.color = "black"
                ubi_state = false
            }
        }