import { Application, Container, type FederatedPointerEvent, Graphics, Text, type TextStyleOptions } from "pixi.js"

const CANVAS_WIDTH = 1300
const CANVAS_HEIGHT = 1000

class Scene extends Container {
  sceneName: string
  bg!: Container & { floor?: Graphics }
  gameCanvas!: Container
  ui!: Container

  constructor(sceneName: string) {
    super()
    this.sceneName = sceneName
  }
}

class DataPoint extends Container {
  graphic!: Graphics
  text!: Text
  UpdateText!: (num: number | string) => void
  data!: FederatedPointerEvent | null
  dragging!: boolean
  line!: Container
  other!: DataPoint
}

type PointLike = { x: number; y: number; angleStart?: number }

;(async () => {
  // Create a new application
  const app = new Application()

  // Initialize the application
  await app.init({
    backgroundAlpha: 0,
    resizeTo: window,
    resolution: Math.max(window.devicePixelRatio || 1, 1),
    autoDensity: true,
  })
  // Append the application canvas to the document body
  // biome-ignore lint/style/noNonNullAssertion: We know this element exists in our HTML
  document.getElementById("pixi-container")!.appendChild(app.canvas)

  const viewport = new Container()
  app.stage.addChild(viewport)

  const updateViewport = () => {
    const scale = Math.min(app.screen.width / CANVAS_WIDTH, app.screen.height / CANVAS_HEIGHT)
    viewport.scale.set(scale)
    viewport.position.set(
      (app.screen.width - CANVAS_WIDTH * scale) / 2,
      (app.screen.height - CANVAS_HEIGHT * scale) / 2
    )
  }

  app.renderer.on("resize", updateViewport)
  updateViewport()

  const defaultLevel = 1
  const levels = [
    {
      canPlay: 1,
      walls: [
        {
          start: { x: 200, y: 200 },
          end: { x: 500, y: 200 },
        },
        {
          start: { x: 500, y: 200 },
          end: { x: 500, y: 500 },
        },
        {
          start: { x: 350, y: 400 },
          end: { x: 500, y: 400 },
        },
        {
          start: { x: 500, y: 500 },
          end: { x: 700, y: 500 },
        },
        {
          start: { x: 700, y: 200 },
          end: { x: 700, y: 500 },
        },
        {
          start: { x: 700, y: 200 },
          end: { x: 1000, y: 200 },
        },
        {
          start: { x: 1000, y: 200 },
          end: { x: 1150, y: 350 },
        },
        {
          start: { x: 1150, y: 350 },
          end: { x: 1150, y: 800 },
        },
        {
          start: { x: 700, y: 800 },
          end: { x: 1150, y: 800 },
        },
        {
          start: { x: 500, y: 800 },
          end: { x: 200, y: 800 },
        },
        {
          start: { x: 200, y: 200 },
          end: { x: 200, y: 800 },
        },
      ],
    },
    {
      canPlay: 3,
      walls: [
        {
          start: { x: 100, y: 100 },
          end: { x: 500, y: 100 },
        },
        {
          start: { x: 500, y: 100 },
          end: { x: 500, y: 200 },
        },
        {
          start: { x: 500, y: 200 },
          end: { x: 800, y: 300 },
        },
        {
          start: { x: 100, y: 750 },
          end: { x: 100, y: 500 },
        },
        {
          start: { x: 100, y: 100 },
          end: { x: 100, y: 250 },
        },
        {
          start: { x: 100, y: 750 },
          end: { x: 250, y: 750 },
        },
        {
          start: { x: 250, y: 850 },
          end: { x: 250, y: 750 },
        },
        {
          start: { x: 250, y: 850 },
          end: { x: 1050, y: 850 },
        },
        {
          start: { x: 550, y: 550 },
          end: { x: 300, y: 550 },
        },
        {
          start: { x: 1050, y: 550 },
          end: { x: 1050, y: 850 },
        },
        {
          start: { x: 1050, y: 550 },
          end: { x: 1200, y: 550 },
        },
        {
          start: { x: 1200, y: 350 },
          end: { x: 1200, y: 550 },
        },
        {
          start: { x: 1200, y: 350 },
          end: { x: 800, y: 350 },
        },
        {
          start: { x: 800, y: 300 },
          end: { x: 800, y: 350 },
        },
      ],
    },
    {
      canPlay: 2,
      walls: [
        {
          start: { x: 100, y: 100 },
          end: { x: 700, y: 100 },
        },
        {
          start: { x: 100, y: 700 },
          end: { x: 100, y: 100 },
        },
        {
          start: { x: 100, y: 700 },
          end: { x: 700, y: 700 },
        },
        {
          start: { x: 200, y: 200 },
          end: { x: 200, y: 500 },
        },
      ],
    },
    {
      canPlay: 1,
      walls: [
        {
          start: { x: 100, y: 100 },
          end: { x: 1000, y: 100 },
        },
        {
          start: { x: 100, y: 700 },
          end: { x: 100, y: 100 },
        },
        {
          start: { x: 100, y: 700 },
          end: { x: 450, y: 700 },
        },
        {
          start: { x: 1000, y: 700 },
          end: { x: 650, y: 700 },
        },
        {
          start: { x: 1000, y: 100 },
          end: { x: 1000, y: 700 },
        },
        {
          start: { x: 200, y: 200 },
          end: { x: 200, y: 500 },
        },
        {
          start: { x: 200, y: 200 },
          end: { x: 800, y: 200 },
        },
        {
          start: { x: 800, y: 500 },
          end: { x: 700, y: 400 },
        },
        {
          start: { x: 800, y: 300 },
          end: { x: 700, y: 400 },
        },
        {
          start: { x: 900, y: 400 },
          end: { x: 800, y: 300 },
        },
        {
          start: { x: 900, y: 400 },
          end: { x: 800, y: 500 },
        },
      ],
    },
  ]
  var currentLevelNum = 0

  var scenes = {
    menuScene: new Scene("menu"),
    gameScene: new Scene("game"),
    currentScene: undefined as Scene | undefined,
    ChangeScene: (sceneName: string) => {
      var scene: Scene
      const prevScene = scenes.currentScene
      if (!prevScene) {
        console.error("ERROR: No current scene")
        return
      }

      switch (prevScene?.sceneName) {
        case "menu":
          app.ticker.add(gameTick)
          break
        case "game":
          app.ticker.remove(gameTick)
          //app.ticker.remove(endTick);
          break
        default:
          break
      }

      viewport.removeChild(prevScene)

      switch (sceneName) {
        case "menu":
          createMenu()
          scene = scenes.menuScene
          break
        case "game":
          scene = scenes.gameScene
          break
        default:
          console.error(`ERROR: Unknown scene: ${sceneName}`)
          return
      }
      scenes.currentScene = scene
      viewport.addChild(scene)
    },
  }
  scenes.currentScene = scenes.menuScene

  scenes.menuScene.sceneName = "menu"
  scenes.gameScene.sceneName = "game"

  viewport.addChild(scenes.currentScene)

  const baseSize = 100

  // UTILS

  // angle between two lines
  // const getAngle = (a: PointLike, b: PointLike, c: PointLike, d: PointLike) => {
  //   //find vector components
  //   const dAx = b.x - a.x
  //   const dAy = b.y - a.y
  //   const dBx = d.x - c.x
  //   const dBy = d.y - c.y
  //   var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy)
  //   if (angle < 0) {
  //     angle = Math.PI * 2 + angle
  //   }
  //   return angle /* * (180 / Math.PI) */
  // }

  // intersection between 2 lines defined by: line1: a,b. line2: c,d
  // const IsIntersecting = (a: PointLike, b: PointLike, c: PointLike, d: PointLike) => {
  //   const denominator = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
  //   const numerator1 = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y)
  //   const numerator2 = (a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y)

  //   // Detect coincident lines
  //   if (denominator === 0) return IsIntersecting(a, b, c, { x: d.x + 1, y: d.y + 1 })

  //   const r = numerator1 / denominator
  //   const s = numerator2 / denominator

  //   return r >= 0 && r <= 1 && s >= 0 && s <= 1
  // }

  // GAME
  scenes.gameScene.bg = new Container()
  scenes.gameScene.addChild(scenes.gameScene.bg)

  scenes.gameScene.gameCanvas = new Container()
  scenes.gameScene.addChild(scenes.gameScene.gameCanvas)

  scenes.gameScene.ui = new Container()
  scenes.gameScene.addChild(scenes.gameScene.ui)

  const textStyle: TextStyleOptions = {
    fontSize: baseSize / 1.5,
    align: "center",
    fontFamily: "Verdana",
    fontVariant: "small-caps",
    fill: 0xffffff,
  }

  const createBg = () => {}
  createBg()

  // const createUI = () => {
  //   scenes.gameScene.ui.removeChildren()
  // }

  const points: DataPoint[] = []

  function onDragStart(this: DataPoint, event: FederatedPointerEvent) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
  }

  function onDragEnd(this: DataPoint) {
    this.alpha = 1
    this.dragging = false
    // set the interaction data to null
    this.data = null
  }

  function onDragMove(this: DataPoint) {
    if (this.dragging && this.data && this.parent) {
      const newPosition = this.data.getLocalPosition(this.parent)
      newPosition.x = Math.round(newPosition.x / 50) * 50
      newPosition.y = Math.round(newPosition.y / 50) * 50

      this.x = newPosition.x
      this.y = newPosition.y

      scenes.gameScene.gameCanvas.removeChild(this.line)
      scenes.gameScene.gameCanvas.removeChild(this.other.line)
      this.line = drawLine({ x: this.x, y: this.y }, this.other)
      this.other.line = drawLine({ x: this.other.x, y: this.other.y }, this)

      this.text.text = `${Math.floor(this.x)}, ${Math.floor(this.y)}\n\n`
    }
  }

  const drawPoint = (x: number, y: number, d?: number) => {
    const diameter = d || 25

    const point = new DataPoint()

    points.push(point)

    scenes.gameScene.ui.addChild(point)
    point.x = x
    point.y = y

    point.graphic = new Graphics()
    point.addChild(point.graphic)

    point.graphic.circle(0, 0, diameter)
    point.graphic.fill(0xffffff)

    point.text = new Text({
      text: `${x}, ${y}\n\n`,
      style: {
        fontSize: 30,
        align: "center",
        fill: 0xffffff,
      },
    })
    point.text.x = diameter / 2
    point.text.y = diameter / 2
    point.text.pivot.x = diameter / 2
    point.text.pivot.y = diameter / 2
    point.text.anchor.set(0.5, 0.5)
    point.addChild(point.text)

    point.UpdateText = (num) => {
      point.text.text = `${point.x}, ${point.y}\n${num}\n`
    }

    return point
  }

  const drawLine = (start: PointLike, end: PointLike) => {
    class Line extends Container {
      graphic!: Graphics
    }

    const line = new Line()
    scenes.gameScene.gameCanvas.addChild(line)

    line.graphic = new Graphics()
    line.addChild(line.graphic)

    // line.graphic.lineStyle(20, 0xffffff, 0.8)
    line.graphic.moveTo(start.x, start.y).lineTo(end.x, end.y).stroke({ color: 0xffffff, width: 10, alpha: 0.8 })

    return line
  }

  // var middlePoint

  const initGame = (num?: number) => {
    if (scenes.currentScene !== scenes.gameScene) scenes.ChangeScene("game")

    if (num !== undefined) {
      currentLevelNum = num
    }
    if (currentLevelNum >= levels.length) {
      console.log(`ERROR: Level ${currentLevelNum} does not exist`)
      currentLevelNum = levels.length - 1
    }

    scenes.gameScene.gameCanvas.removeChildren()
    scenes.gameScene.ui.removeChildren()
    scenes.gameScene.bg.removeChildren()

    points.length = 0

    levels[currentLevelNum].walls.forEach((w) => {
      const line = drawLine(w.start, w.end)

      const start = drawPoint(w.start.x, w.start.y, 20)
      const end = drawPoint(w.end.x, w.end.y, 20)

      start.eventMode = "static"
      start.interactive = true
      start.line = line
      start.other = end
      start
        .on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove)

      end.eventMode = "static"
      end.interactive = true
      end.line = line
      end.other = start
      end
        .on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove)
    })

    //CheckPoints()
  }

  const createGround = (corners: PointLike[]) => {
    //console.log(corners)
    const path: number[] = []

    const floor = new Graphics()
    scenes.gameScene.bg.floor = floor
    scenes.gameScene.bg.addChild(floor)

    corners.forEach((corner) => {
      path.push(corner.x)
      path.push(corner.y)
    })

    floor.poly(path)
    floor.fill(0x505050)
  }

  // function GetCorners(walls: { start: PointLike; end: PointLike }[]) {
  //   const points: PointLike[] = []

  //   function AddPoint(x: number, y: number) {
  //     // not repeat points
  //     const drawnPoint = points.filter((p) => p.x === x && p.y === y)[0]
  //     if (!drawnPoint) {
  //       points.push({ x: x, y: y })
  //     }
  //   }

  //   walls.forEach((w) => {
  //     AddPoint(w.start.x, w.start.y)
  //     AddPoint(w.end.x, w.end.y)
  //   })

  //   return points
  // }

  // points defined by = [{x, y}, {x, y}, ... ]
  function GetConvexHull(points: PointLike[]) {
    // there is no inside points
    if (points.length <= 3) return points

    // Start point: lowest Y coordinate
    var start = points[0]
    for (let i = 0; i < points.length; i++) {
      if (
        points[i].y < start.y || // lowest Y coordinate
        (points[i].y === start.y && points[i].x < start.x) // if same Y, lowest x
      )
        start = points[i]
    }
    /* console.log(start) */

    // Sort them by lowest angle
    for (let i = 0; i < points.length; i++) {
      points[i].angleStart = Math.atan2(points[i].y - start.y, points[i].x - start.x)
    }
    points.sort((a, b) => {
      // sort them by the angle with the start point, or by lowest x
      return a.angleStart === b.angleStart ? a.x - b.x : (a.angleStart || 0) - (b.angleStart || 0)
    })

    //console.log(points)

    // Adding points to the result if they "turn left"
    var result = [points[0]],
      len = 1

    for (let i = 1; i < points.length; i++) {
      let a = result[len - 2],
        b = result[len - 1],
        point = points[i]

      while (
        (len === 1 && b.x === point.x && b.y === point.y) || // same point case
        (len > 1 && (b.x - a.x) * (point.y - a.y) <= (b.y - a.y) * (point.x - a.x)) // if it turns right
      ) {
        len--
        b = a
        a = result[len - 2]
      }

      result[len] = point
      len++
    }

    // to close the polygon
    result.length = len

    return result
  }

  const gameTick = () => {
    scenes.gameScene.bg.removeChildren()

    const output = GetConvexHull(points)

    var i = 0
    points.forEach((point) => {
      if (output.includes(point)) {
        point.graphic.tint = 0xa476ff
        point.UpdateText(i++)
      } else {
        point.graphic.tint = 0x808080
        point.UpdateText("")
      }
    })
    createGround(output)
  }

  // MENU
  const colors = [
    // normal
    0x0000ff, // 0
    0x00ff00, // 1
    0xff0000, // 2
    0x00ffff, // 3
    0xffffff, // 4
    0x0390ff, // 5
    0x000000, // 6
    0x000000, // 7
    0x000000, // 8
    0x000000, // 9
    // spetials
    0xffd700, // 10
    0x000000, // 11
    0x000000, // 12
  ]

  const createButton = (size: number, type: number, text: string, textSize: number, action: () => void) => {
    class ContainerWithCircle extends Container {
      circle!: Graphics
      text!: Text
    }

    const button = new ContainerWithCircle()

    button.circle = new Graphics()
    button.circle.beginFill(0xffffff)
    button.circle.drawRect(-size / 2, -size / 2, size, size)
    button.circle.endFill()

    // if (!isMobile.any) button.circle.filters = [new BlurFilter(2)]
    button.circle.tint = colors[type]
    button.circle.alpha = 0.85
    button.addChild(button.circle)

    button.text = new Text({
      text,
      style: {
        ...textStyle,
        fontSize: textSize,
      },
    })

    button.text.x = size / 2
    button.text.y = size / 2
    button.text.pivot.x = size / 2
    button.text.pivot.y = size / 2
    button.text.anchor.set(0.5, 0.5)
    button.addChild(button.text)

    // app.ticker.add(() => {
    //   button.rotation += 0.01
    // })

    button.circle.interactive = true
    button.circle.eventMode = "static"
    button.circle.on("pointerdown", action)

    return button
  }

  const createMenu = () => {
    scenes.menuScene.removeChildren()

    const container = new Container()
    scenes.menuScene.addChild(container)

    const nLevels = levels.length
    const sqrSize = Math.floor(Math.sqrt(nLevels))
    for (let i = 0; i < nLevels; i++) {
      const canPlay = levels[i]?.canPlay

      const type = canPlay ? canPlay : -1
      const bubble = createButton(baseSize, type, `${i + 1}`, baseSize / 2, () => initGame(i))
      if (!canPlay) {
        bubble.alpha = 0.5
        bubble.circle.interactive = false
        bubble.circle.eventMode = "none"
      }
      bubble.x = (i % sqrSize) * baseSize * 1.2 + baseSize / 2
      bubble.y = Math.floor(i / sqrSize) * baseSize * 1.2 + baseSize / 2
      bubble.text.style.fill = 0xffffff
      container.addChild(bubble)
    }

    // Move container to the center
    container.x = CANVAS_WIDTH / 2
    container.y = CANVAS_HEIGHT / 2

    // Center group
    container.pivot.x = container.width / 2
    container.pivot.y = container.height / 2

    /* const bg = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0, 0, container.width, container.height).endFill()
            bg.alpha = 0.5
            container.addChild(bg) */

    const levelselectText = new Text({
      text: "Choose scenario",
      style: {
        ...textStyle,
        fill: 0xefefef,
      },
    })
    levelselectText.anchor.set(0.5, 0.5)
    levelselectText.resolution = devicePixelRatio
    levelselectText.x = CANVAS_WIDTH / 2
    levelselectText.y = CANVAS_HEIGHT / 2 - container.height / 2 - 150

    scenes.menuScene.addChild(levelselectText)
  }

  createMenu()

  if (defaultLevel >= 0) initGame(defaultLevel)

  document.addEventListener("keydown", (e) => {
    //console.log(scenes.currentScene.sceneName)
    /* if (e.repeat)
                return; */

    switch (scenes.currentScene?.sceneName) {
      case "menu":
        switch (e.keyCode) {
          case 32: // scpace
            initGame()
            break
          default:
            break
        }

        break
      case "game":
        switch (e.keyCode) {
          case 27: // esc
            scenes.ChangeScene("menu")
            break

          case 38: // up
          case 87:
            e.preventDefault()
            break
          case 40: // down
          case 83:
            e.preventDefault()
            break
          case 37: // left
          case 65:
            e.preventDefault()
            break
          case 39: // right
          case 68:
            e.preventDefault()
            break
          case 82: // r
            initGame()
            //reverse()
            break
          case 84: // t
            //transpose()
            break
          default:
            break
        }

        break
      default:
        break
    }
  })
})()
