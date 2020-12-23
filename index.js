const visuals = p => {
  
  let bgGraphics, maskGraphics
  let numRects = 20
  let rects = []
  let loop, amplitude

  p.preload = () => {
    p.soundFormats('ogg', 'mp3')
    loop = p.loadSound('audio/loop.mp3')
  }

  p.setup = () => {
    p.createCanvas(640, 480)
    bgGraphics = p.createGraphics(p.width, p.height)
    maskGraphics = p.createGraphics(p.width, p.height)
    for(let i = 0; i < numRects; i++){
      rects.push(p.map(i, 0, numRects, -20, p.height))
    }
    loop.setLoop(true)
  }
  
  p.draw = () => {
    drawBg()
    drawBgRects()
    let bgImg = bgGraphics.get()
    let maskImg = makeCircleMask(maskGraphics, calcSize())
    bgImg.mask(maskImg)
    p.fill(0)
    p.rect(0, 0, p.width, p.height)
    p.image(bgImg, 0, 0)
    
  }
  
  p.mousePressed = () => {
    if(p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height){
      toggleAudio()
    }
  }
  
  const toggleAudio = () => {
    if(loop.isPlaying()) {
      loop.stop()
      amplitude = null //disconnect the amp analyzer on start
    } else {
      loop.play()
      amplitude = new p5.Amplitude() // (re)create amp analyzer on start
      amplitude.setInput(loop) 
    }
  }
  
  const makeCircleMask = (graphics, size) => {
    graphics.clear()
    graphics.background(0, 0)
    graphics.noStroke()
    graphics.fill(255)
    graphics.circle(p.width/2, p.height * 0.55, size)
    return graphics.get()
  }

  const drawBg = () => {
    const c1 = p.color(255, 0, 255)
    const c2 = p.color(255, 255, 0)
    for(let i = 0; i <= bgGraphics.height; i++){
      let inter = i / bgGraphics.height
      let c = p.lerpColor(c1, c2, inter)
      bgGraphics.stroke(c)
      bgGraphics.line(0, i, bgGraphics.width, i)
    }
  }
  
  const drawBgRects = () => {
    rects.forEach((rect, i) => {
      if(amplitude) rects[i] = rect > bgGraphics.height ? -20 : rect + 1
      drawRect(rect)
    })
  }

  const drawRect = (y) => {
    let h = p.map(y, 0, bgGraphics.height, 25, 0)
    bgGraphics.noStroke()
    bgGraphics.fill('rgba(218, 165, 32, 0.5)')
    bgGraphics.rect(0, y, bgGraphics.width, h)
  }

  const calcSize = () => {
    let rad = p.height * 0.3
    if(amplitude){
      let level = amplitude.getLevel()
      rad = p.map(level, 0, 1, p.height * 0.3, p.height * 5)
    }
    return rad
  }
}

const buildFooter = () => {
  const footer = document.querySelector("footer")
  const d = new Date()
  const yr = d.getFullYear()
  footer.textContent = `\u00A9${yr}, Gunboat Diplomacy`
}

window.onload = () => {
  const container = document.querySelector("#visuals-container")
  buildFooter()
  const p5Instance = new p5(visuals, container)
}
