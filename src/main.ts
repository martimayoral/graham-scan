import {
  Application,
  Container,
  type FederatedPointerEvent,
  Graphics,
  Rectangle,
  Text,
  type TextStyleOptions,
} from "pixi.js"

const CANVAS_WIDTH = 1300
const CANVAS_HEIGHT = 1000

class Bg extends Container {
  floorBefore: Graphics
  floorAfter: Graphics
  beforeMask: Graphics
  afterMask: Graphics

  constructor() {
    super()

    this.floorBefore = new Graphics()
    this.addChild(this.floorBefore)

    this.floorAfter = new Graphics()
    this.addChild(this.floorAfter)

    this.beforeMask = new Graphics()
    this.addChild(this.beforeMask)

    this.afterMask = new Graphics()
    this.addChild(this.afterMask)

    this.floorBefore.mask = this.beforeMask
    this.floorAfter.mask = this.afterMask
  }
}

class Scene extends Container {
  sceneName: string
  bg!: Bg
  gameCanvas!: Container
  ui!: Container
  splitDivider!: Graphics
  splitLabel!: Text

  constructor(sceneName: string) {
    super()
    this.sceneName = sceneName
  }
}

class DataPoint extends Container {
  graphic!: Graphics
  text!: Text
  UpdateText!: (num: number | string) => void
  RenderStyle!: () => void
  data!: FederatedPointerEvent | null
  dragging!: boolean
  dragRadius!: number
  hovered!: boolean
  fillColor!: number
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

  const defaultLevel = -1
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
          end: { x: 500, y: 250 },
        },
        {
          start: { x: 500, y: 250 },
          end: { x: 800, y: 250 },
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
          start: { x: 250, y: 850 },
          end: { x: 100, y: 750 },
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
          start: { x: 800, y: 250 },
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

      viewport.removeChild(prevScene)

      switch (sceneName) {
        case "menu":
          createMenu()
          window.location.hash = ""
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

  // GAME
  scenes.gameScene.bg = new Bg()
  scenes.gameScene.addChild(scenes.gameScene.bg)

  scenes.gameScene.gameCanvas = new Container()
  scenes.gameScene.addChild(scenes.gameScene.gameCanvas)

  scenes.gameScene.ui = new Container()
  scenes.gameScene.ui.sortableChildren = true
  scenes.gameScene.addChild(scenes.gameScene.ui)

  scenes.gameScene.splitDivider = new Graphics()
  scenes.gameScene.splitDivider.eventMode = "static"
  scenes.gameScene.splitDivider.cursor = "ew-resize"
  scenes.gameScene.splitDivider.on("mouseover", () => (scenes.gameScene.splitDivider.alpha = 0.5))
  scenes.gameScene.splitDivider.on("mouseout", () => {
    if (!dividerDragging) scenes.gameScene.splitDivider.alpha = 1
  })
  scenes.gameScene.splitDivider.on("pointerdown", (event: FederatedPointerEvent) => {
    dividerDragging = true
    scenes.gameScene.splitDivider.alpha = 0.5
    event.stopPropagation()
    setSplitFromEvent(event)
  })
  scenes.gameScene.addChild(scenes.gameScene.splitDivider)

  const textStyle: TextStyleOptions = {
    fontSize: baseSize / 1.5,
    align: "center",
    fontFamily: "Verdana",
    fontVariant: "small-caps",
    fill: 0xffffff,
  }

  const points: DataPoint[] = []
  let draggedPoint: DataPoint | null = null
  const POINT_DEFAULT_ALPHA = 1
  const POINT_HOVER_ALPHA = 0.7
  const POINT_DRAG_ALPHA = 0.5

  const DRAG_PICK_PADDING = 20
  const DIVIDER_BAR_WIDTH = 10
  let splitX = CANVAS_WIDTH / 2
  let dividerDragging = false

  const onStopDividerDrag = () => {
    dividerDragging = false
    scenes.gameScene.splitDivider.alpha = 1
  }

  const updateSplitView = () => {
    splitX = Math.max(0, Math.min(CANVAS_WIDTH, splitX))

    scenes.gameScene.bg.beforeMask.clear()
    scenes.gameScene.bg.beforeMask.rect(0, 0, splitX, CANVAS_HEIGHT)
    scenes.gameScene.bg.beforeMask.fill(0xffffff)

    scenes.gameScene.bg.afterMask.clear()
    scenes.gameScene.bg.afterMask.rect(splitX, 0, CANVAS_WIDTH - splitX, CANVAS_HEIGHT)
    scenes.gameScene.bg.afterMask.fill(0xffffff)

    scenes.gameScene.splitDivider.clear()
    scenes.gameScene.splitDivider
      .rect(splitX - DIVIDER_BAR_WIDTH / 2, 0, DIVIDER_BAR_WIDTH, CANVAS_HEIGHT)
      .fill({ color: 0xffffff, alpha: 0.9 })

    scenes.gameScene.addChild(scenes.gameScene.splitDivider)
    scenes.gameScene.splitLabel.x = splitX
  }

  scenes.gameScene.splitLabel = new Text({
    text: "before   after  ",
    style: {
      fontSize: 40,
      align: "center",
      fontFamily: "Verdana",
      fontVariant: "small-caps",
      fill: 0xefefef,
    },
  })
  scenes.gameScene.splitLabel.anchor.set(0.5, 1)
  scenes.gameScene.splitLabel.y = CANVAS_HEIGHT - 16
  scenes.gameScene.addChild(scenes.gameScene.splitLabel)

  const setSplitFromEvent = (event: FederatedPointerEvent) => {
    const position = event.getLocalPosition(scenes.gameScene)
    splitX = position.x
    updateSplitView()
  }

  const getClosestPoint = (position: PointLike): DataPoint | null => {
    let closestPoint: DataPoint | null = null
    let closestDistance = Number.POSITIVE_INFINITY

    points.forEach((point) => {
      const hitRadius = point.dragRadius + DRAG_PICK_PADDING
      const dx = point.x - position.x
      const dy = point.y - position.y
      const distance = dx * dx + dy * dy

      if (distance <= hitRadius * hitRadius && distance < closestDistance) {
        closestDistance = distance
        closestPoint = point
      }
    })

    return closestPoint
  }

  const updateLine = (point: DataPoint) => {
    scenes.gameScene.gameCanvas.removeChild(point.line)

    const line = drawLine({ x: point.x, y: point.y }, point.other)
    point.line = line
    point.other.line = line
  }

  const updateDraggedPoint = (point: DataPoint, event: FederatedPointerEvent) => {
    const newPosition = event.getLocalPosition(scenes.gameScene.ui)
    newPosition.x = Math.round(newPosition.x / 50) * 50
    newPosition.y = Math.round(newPosition.y / 50) * 50

    point.x = newPosition.x
    point.y = newPosition.y

    updateLine(point)
    point.text.text = `${Math.floor(point.x)}, ${Math.floor(point.y)}\n\n`
  }

  function onDragStart(event: FederatedPointerEvent) {
    const point = getClosestPoint(event.getLocalPosition(scenes.gameScene.ui))

    if (!point) return

    draggedPoint = point
    point.data = event.data
    point.alpha = POINT_DRAG_ALPHA
    point.dragging = true

    updateDraggedPoint(point, event)
  }

  function onDragEnd() {
    onStopDividerDrag()

    if (!draggedPoint) return

    draggedPoint.alpha = draggedPoint.hovered ? POINT_HOVER_ALPHA : POINT_DEFAULT_ALPHA
    draggedPoint.dragging = false
    draggedPoint.data = null
    draggedPoint = null
  }

  function onDragMove(event: FederatedPointerEvent) {
    if (dividerDragging) {
      setSplitFromEvent(event)
      return
    }

    if (!draggedPoint?.dragging) return

    draggedPoint.data = event.data
    updateDraggedPoint(draggedPoint, event)

    updateViewer()
  }

  const drawPoint = (x: number, y: number, d?: number) => {
    const diameter = d || 25

    const point = new DataPoint()

    points.push(point)

    scenes.gameScene.ui.addChild(point)
    point.x = x
    point.y = y
    point.dragRadius = diameter
    point.hovered = false
    point.fillColor = 0xffffff
    point.alpha = POINT_DEFAULT_ALPHA

    point.graphic = new Graphics()
    point.addChild(point.graphic)

    const renderPointStyle = () => {
      point.graphic.clear()
      point.graphic.circle(0, 0, diameter)
      point.graphic.fill(point.fillColor)

      if (point.hovered) {
        point.graphic.stroke({ color: 0xffffff, width: 5, alpha: 0.75 })
      }
    }

    point.RenderStyle = renderPointStyle

    renderPointStyle()

    point.eventMode = "static"
    point.cursor = "pointer"
    point.on("pointerover", () => {
      point.hovered = true
      if (!point.dragging) point.alpha = POINT_HOVER_ALPHA
      renderPointStyle()
    })
    point.on("pointerout", () => {
      point.hovered = false
      point.alpha = point.dragging ? POINT_DRAG_ALPHA : POINT_DEFAULT_ALPHA
      renderPointStyle()
    })

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

  scenes.gameScene.ui.eventMode = "static"
  scenes.gameScene.ui.hitArea = new Rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  scenes.gameScene.ui.on("pointerdown", onDragStart)

  app.stage.eventMode = "static"
  app.stage.on("globalpointermove", onDragMove)
  app.stage.on("pointerup", onDragEnd)
  app.stage.on("pointerupoutside", onDragEnd)

  updateSplitView()

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
    if (currentLevelNum < 0) {
      console.log(`ERROR: Level ${currentLevelNum} does not exist`)
      currentLevelNum = 0
    }

    const scenarioHash = `#${currentLevelNum + 1}`
    if (window.location.hash !== scenarioHash) {
      window.history.replaceState(null, "", scenarioHash)
    }

    scenes.gameScene.gameCanvas.removeChildren()
    scenes.gameScene.ui.removeChildren()

    points.length = 0

    splitX = CANVAS_WIDTH / 2
    updateSplitView()

    levels[currentLevelNum].walls.forEach((w) => {
      const line = drawLine(w.start, w.end)

      const start = drawPoint(w.start.x, w.start.y, 20)
      const end = drawPoint(w.end.x, w.end.y, 20)

      start.line = line
      start.other = end

      end.line = line
      end.other = start
    })

    updateViewer()
  }

  const createGroundBefore = (corners: PointLike[]) => {
    scenes.gameScene.bg.floorBefore.clear()

    const bounds = {
      xMin: Infinity,
      xMax: -Infinity,
      yMin: Infinity,
      yMax: -Infinity,
    }

    corners.forEach((corner) => {
      if (corner.x < bounds.xMin) bounds.xMin = corner.x
      if (corner.x > bounds.xMax) bounds.xMax = corner.x
      if (corner.y < bounds.yMin) bounds.yMin = corner.y
      if (corner.y > bounds.yMax) bounds.yMax = corner.y
    })

    // console.log(bounds)
    scenes.gameScene.bg.floorBefore.rect(bounds.xMin, bounds.yMin, bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin)
    scenes.gameScene.bg.floorBefore.fill(0x505050)
  }

  const createGroundAfter = (corners: PointLike[]) => {
    //console.log(corners)
    const path: number[] = []
    scenes.gameScene.bg.floorAfter.clear()

    corners.forEach((corner) => {
      path.push(corner.x)
      path.push(corner.y)
    })

    scenes.gameScene.bg.floorAfter.poly(path)
    scenes.gameScene.bg.floorAfter.fill(0x5050ff)
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

  const updateViewer = () => {
    const output = GetConvexHull(points)

    var i = 0
    points.forEach((point) => {
      if (output.includes(point)) {
        point.zIndex = 1
        point.fillColor = 0xa476ff
        point.RenderStyle()
        point.UpdateText(i++)
      } else {
        point.zIndex = 0
        point.fillColor = 0x808080
        point.RenderStyle()
        point.UpdateText("")
      }
    })
    createGroundBefore(output)
    createGroundAfter(output)
  }

  const getLevelFromHash = () => {
    const rawHash = window.location.hash.replace(/^#/, "").trim()
    if (!rawHash) return undefined
    if (!/^\d+$/.test(rawHash)) return undefined

    const scenarioNumber = Number(rawHash)
    const levelIndex = scenarioNumber - 1
    if (levelIndex < 0 || levelIndex >= levels.length) return undefined

    return levelIndex
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
    button.circle.rect(-size / 2, -size / 2, size, size)
    button.circle.fill(0xffffff)

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

  const initialLevelFromHash = getLevelFromHash()
  if (initialLevelFromHash !== undefined) {
    initGame(initialLevelFromHash)
  } else if (defaultLevel >= 0) {
    initGame(defaultLevel)
  }

  window.addEventListener("hashchange", () => {
    const levelFromHash = getLevelFromHash()
    if (levelFromHash !== undefined) {
      initGame(levelFromHash)
    }
  })

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
