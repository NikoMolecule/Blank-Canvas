window.addEventListener('load', () => {
    const canvas = document.querySelector('.paint')
    const context = canvas.getContext("2d")

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    let drawing = false;

    function drawActive(event){
        drawing = true;
        creatingCanvas(event)
    }

    function drawInactive(){
        drawing = false;
        context.beginPath()
    }

    function creatingCanvas(event){
        if(!drawing) return;
        context.lineWidth = 5
        context.lineCap = "round"

        context.lineTo(event.clientX, event.clientY)
        context.stroke()
        context.beginPath()
        context.moveTo(event.clientX, event.clientY)
    }

    canvas.addEventListener("mousedown", drawActive)
    canvas.addEventListener("mouseup", drawInactive)
    canvas.addEventListener("mousemove", creatingCanvas)
})