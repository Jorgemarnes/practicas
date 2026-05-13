        let boton = document.getElementById("entradas")
        let ubi = document.getElementById("ubicacion1")
        let ubi2 = document.getElementById("ubicacion2")
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
        function animacion_ubi1() {
            if (!ubi_state) {
                ubi.style.color = "blue"
                ubi_state = true
            }
            else {
                ubi.style.color = "black"
                ubi_state = false
            }
        }
        function animacion_ubi2() {
            if (!ubi_state) {
                ubi2.style.color = "blue"
                ubi_state = true
            }
            else {
                ubi2.style.color = "black"
                ubi_state = false
            }
        }