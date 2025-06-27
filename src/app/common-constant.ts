export const imageFrontUrls = [
  { key: 'Onyx black', value: 'assets/Tees/black-f.png' },
  { key: 'Pearl white', value: 'assets/Tees/white-f.png' },
  { key: 'Sapphire blue', value: 'assets/Tees/blue-f.png' },
  { key: 'Ruby maroon', value: 'assets/Tees/maroon-f.png' },
];
export const imageBackUrls = [
  { key: 'Onyx black', value: 'assets/Tees/black-b.png' },
  { key: 'Pearl white', value: 'assets/Tees/white-b.png' },
  { key: 'Sapphire blue', value: 'assets/Tees/blue-b.png' },
  { key: 'Ruby maroon', value: 'assets/Tees/maroon-b.png' },
];

export const clipArts = [
  { id: 3, name: 'arcss', url: 'assets/Shapes/cliparts/arcss.png' },
  { id: 4, name: 'eagle', url: 'assets/Shapes/cliparts/eagle.png' },
  { id: 5, name: 'flower', url: 'assets/Shapes/cliparts/flower.png' },
  { id: 6, name: 'lines', url: 'assets/Shapes/cliparts/lines.png' },
  { id: 7, name: 'planet', url: 'assets/Shapes/cliparts/planet.png' },
  { id: 8, name: 'Alternate_arrow', url: 'assets/Shapes/cliparts/Alternate_arrow.png' },
  { id: 9, name: 'dark_arrow', url: 'assets/Shapes/cliparts/dark_arrow.png' },
  { id: 10, name: 'barcode', url: 'assets/Shapes/cliparts/barcode.png' },
  { id: 11, name: 'Corner_line', url: 'assets/Shapes/cliparts/Corner_line.png' },
  { id: 12, name: 'star', url: 'assets/Shapes/cliparts/star.png' },
  { id: 13, name: 'tree', url: 'assets/Shapes/cliparts/tree.png' },
  { id: 15, name: 'weed', url: 'assets/Shapes/cliparts/weed.png' },
];

export const graphics = [
  { id: 1, name: 'butterfly', url: 'assets/Shapes/illustrations/butterfly.png' },
  { id: 2, name: 'cat', url: 'assets/Shapes/illustrations/cat.png' },
  { id: 3, name: 'sakura', url: 'assets/Shapes/illustrations/sakura.png' },

]

export const legends = [
  { id: 1, name: 'legend-1', url: 'assets/Shapes/legends/legend-1.png' },
  { id: 2, name: 'legend-2', url: 'assets/Shapes/legends/legend-2.png' },
];

export const singleSide = [
  { id: 1, name: 'heatWave', url: 'assets/Templates/single_side/HeatWave.png' },
  { id: 1, name: 'immature', url: 'assets/Templates/single_side/Immature.png' },
  { id: 1, name: 'mustang', url: 'assets/Templates/single_side/Mustang.png' },
];

export const doubleSide = [
  { id: 1, doubleside: true, teeColor: 0, name: 'authentic', url: 'assets/Templates/double_side/Authentic.png' },
  { id: 6, doubleside: true, teeColor: 3, name: 'monaliza', url: 'assets/Templates/double_side/monaliza.png' },
  { id: 2, doubleside: true, teeColor: 0, name: 'butterfly', url: 'assets/Templates/double_side/butterfly.png' },
  { id: 3, doubleside: true, teeColor: 1, name: 'flyingHigh', url: 'assets/Templates/double_side/flyingHigh.png' },
  // { id: 4, name: 'pensive', url: 'assets/Templates/double_side/pensive.jpeg' },
  { id: 5, doubleside: true, teeColor: 1, name: 'sakura', url: 'assets/Templates/double_side/sakura.png' },
]

export const fabricTemplate = [

  //duality-front
  {
    name: 'authentic_front',
    elements: [
      {
        text: 'AUTHENTIC',
        left: 150,
        top: 200,
        fontSize: 55,
        fontFamily: 'Arial Black',
        fill: '#FFFFFF',
        lineHeight: 0.8,
        charSpacing: -50,
        type: 'text',
        objectType: 'text'
      },
    ]
  },
  {
    name: 'monaliza_front',
    elements: [
      {
        type: 'text',
        text: 'La Gioconda',
        left: 180,
        top: 50,
        fontSize: 54,
        fontFamily: 'NightRumble',
        fill: '#FFC300',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
    ]
  },
  {
    name: 'butterfly_front',
    elements: [
      {
        text: 'Butterfly',
        left: 230,
        top: 320,
        fontSize: 80,
        fontFamily: 'Old English Text MT',
        fill: '#FFFFFF',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
    ]
  },
  {
    name: 'flyingHigh_front',
    elements: [
      {
        text: 'फ़्लाइंग हाई',
        left: 350,
        top: 120,
        fontSize: 54,
        fontFamily: 'Oswald',
        fontWeight: 'bold',
        fill: '#f67ac6',
        type: 'text',
        objectType: 'text',
        lineHeight: 1.2,
      },
    ]
  },
  {
    name: 'sakura_front',
    elements: [
      {
        text: '🌸サクラ🌸',
        left: 190,
        top: 480,
        fontSize: 54,
        fontFamily: 'Old English Text MT',
        fill: 'red',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
    ]
  },

  //duality
  {
    name: 'authentic',
    elements: [
      {
        text: 'NO MATTER WHAT,\nALWAYS BE',
        left: 150,
        top: 100,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'AUTHENTIC',
        left: 150,
        top: 360,
        fontSize: 55,
        fontFamily: 'Arial Black',

        fill: '#FFFFFF',
        lineHeight: 0.8,
        charSpacing: -50,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'AUTHENTIC',
        left: 150,
        top: 580,
        fontSize: 55,
        fontFamily: 'Arial Black',

        fill: '#FFFFFF',
        lineHeight: 0.8,
        charSpacing: -50,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'AUTHENTIC',
        left: 150,
        top: 800,
        fontSize: 55,
        fontFamily: 'Arial Black',

        fill: '#FFFFFF',
        lineHeight: 0.8,
        charSpacing: -50,
        type: 'text',
        objectType: 'text'
      },
      {
        // Center image (statue)
        left: 0,
        top: 510,
        scaleX: 1.22,
        scaleY: 1.2,
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/legends/legend-2.png', // You will inject your statue image here
        objectCaching: false,
        name: 'statueImage'
      },
      {
        // Bottom left stripes image
        left: 0,
        top: 2630,
        scaleX: 0.32,
        scaleY: 0.39,
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/lines.png', // You will inject your bottom-left image (stripes) here
        objectCaching: false,
        name: 'lines'
      },
      {
        // Bottom right flower/star image
        left: 1520,
        top: 2640,
        scaleX: 0.22,
        scaleY: 0.22,
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/flower.png', // You will inject your bottom-right icon here
        objectCaching: false,
        name: 'flower'
      },
      {
        text: 'SLOW PROGRESS IS\nSTILL PROGRESS',
        left: 710,
        top: 2680,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text'
      }
    ]
  },
  {
    name: 'butterfly',
    elements: [
      {
        // Purple butterfly image
        left: 120,
        top: 100,
        scaleX: 1.2,
        scaleY: 1.2,
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/illustrations/butterfly.png', // Use your own uploaded path or CDN URL
        objectCaching: false,
        name: 'butterflyImage'
      },
      {
        text: 'Butterfly',
        left: 230,
        top: 320,
        fontSize: 80,
        fontFamily: 'Old English Text MT', // or similar gothic style font

        fill: '#FFFFFF',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'Butterfly',
        left: 230,
        top: 700,
        fontSize: 80,
        fontFamily: 'Old English Text MT',

        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'Butterfly',
        left: 230,
        top: 1080,
        fontSize: 80,
        fontFamily: 'Old English Text MT',

        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },

      {
        // Description text
        text: 'Delicate doesn’t mean weak.',
        left: 320,
        top: 2100,
        fontSize: 20,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fill: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 1.4,
        type: 'text',
        objectType: 'text'
      },
      {
        // Icon star shapes (for simplicity, treated as images)
        left: 200,
        top: 1600,
        scaleX: 0.4,
        scaleY: 0.4,
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/star.png',
        objectCaching: false,
        name: 'star1'
      },
      {
        left: 760,
        top: 1600,
        scaleX: 0.4,
        scaleY: 0.4,
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/star.png',
        objectCaching: false,
        name: 'star2'
      },
      {
        left: 1320,
        top: 1600,
        scaleX: 0.4,
        scaleY: 0.4,
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/star.png',
        objectCaching: false,
        name: 'star3'
      }
    ]
  },
  {
    name: 'flyingHigh',
    elements: [

      {
        type: 'image',
        objectType: 'image',
        left: 0,
        // left: 200 - (7 * 40) / 2 + i * 40,
        top: 400,
        scaleX: 1.35,
        scaleY: 0.6,
        url: 'assets/Shapes/grids/Area.png',
        objectCaching: false,
        name: `area_grid`
      },
      {
        text: 'FLYING HIGH',
        left: 250,
        top: 60,
        fontSize: 40,
        fontFamily: 'Arial Black',

        fill: '#f67ac6',
        type: 'text',
        objectType: 'text',
        lineHeight: 1.2,
      },
      {
        text: 'FLYING HIGH',
        left: 250,
        top: 120,
        fontSize: 40,
        fontFamily: 'Arial Black',

        fill: '#f67ac6',
        type: 'text',
        objectType: 'text',
        lineHeight: 1.2,
        textheight: 20,
      },
      {
        text: 'FLYING HIGH',
        left: 250,
        top: 180,
        fontSize: 40,
        fontFamily: 'Arial Black',

        fill: '#f67ac6',
        type: 'text',
        objectType: 'text',
        lineHeight: 1.2,
        textheight: 20,
      },
      ...Array.from({ length: 6 }).map((_, i) => ({
        type: 'image',
        objectType: 'image',
        left: 80 + i * 300,
        // left: 200 - (7 * 40) / 2 + i * 40,
        top: 440,
        scaleX: 0.2,
        scaleY: 0.2,
        url: 'assets/Shapes/cliparts/weed.png',
        objectCaching: false,
        name: `weedLeaf_${i}`
      })),
      {
        // Pink dashed line under leaves
        type: 'line',
        top: 840,
        left: 100,
        objectType: 'shape',
        x1: 240,
        y1: 0,
        x2: 500,
        y2: 0,
        stroke: '#f67ac6',
        strokeWidth: 8,
        strokeDashArray: [20, 5],
        selectable: false
      },
      {
        type: 'line',
        top: 840, // vertical position on canvas
        objectType: 'shape',
        left: 1400,
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0,
        stroke: '#f67ac6',
        strokeWidth: 8,
        strokeDashArray: [100, 1000], // Only one dash
        selectable: false
      },
      {
        text: 'You attract the energy that you give off.\nSpread good vibes. Think positively. Enjoy life.',
        left: 150,
        top: 920,
        fontSize: 8,
        fontFamily: 'Arial',
        fill: '#f67ac6',
        fontStyle: 'italic',
        type: 'text',
        objectType: 'text',
        lineHeight: 1.2,
      },
      {
        text: 'Limited Edition',
        left: 1350,
        top: 900,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#f67ac6',
        fontStyle: 'italic',
        textAlign: 'right',
        type: 'text',
        objectType: 'text'
      },
      {
        // Grid tunnel perspective
        left: 80,
        top: 1040,
        scaleX: 1.4,
        scaleY: 1,
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/grids/center_box.png', // Use your grid PNG here
        objectCaching: false,
        name: 'grid'
      },
      {
        // Grid tunnel perspective
        left: 280,
        top: 2070,
        scaleX: 0.15,
        scaleY: 0.15,
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/star.png', // Use your grid PNG here
        objectCaching: false,
        name: 'grid'
      },
      {
        // Grid tunnel perspective
        left: 1380,
        top: 2100,
        scaleX: 0.19,
        scaleY: 0.19,
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/dark_arrow.png', // Use your grid PNG here
        objectCaching: false,
        name: 'grid'
      },
      {
        text: 'DIMENSION',
        left: 1780,
        top: 1050,
        angle: 90,
        fontSize: 31,
        fontFamily: 'Arial Black',

        fill: '#40b4ff',
        textAlign: 'center',
        type: 'text',
        objectType: 'text',
      },
      {
        text: 'DIMENSION',
        left: 1740,
        top: 1050,
        angle: 90,
        fontSize: 31,
        fontFamily: 'Arial Black',

        textAlign: 'center',
        type: 'text',
        objectType: 'text',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: '#40b4ff',
        charSpacing: 0,
        lineHeight: 1,
      },
      {
        text: 'DIMENSION',
        left: 1700,
        top: 1050,
        angle: 90,
        fontSize: 31,
        fontFamily: 'Arial Black',

        textAlign: 'center',
        type: 'text',
        objectType: 'text',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: '#40b4ff',
        charSpacing: 0,
        lineHeight: 1,
        textheight: 17,
      },
      // Pink vertical bars next to "DIMENSION"

      ...Array.from({ length: 10 }).map((_, i) => ({
        type: 'rect',
        objectType: 'shape',
        left: 1490,
        top: 1740 + i * 30,
        width: 9,
        height: 4,
        fill: '#f67ac6',
      })),
      {
        type: 'rect',
        objectType: 'shape',
        left: 1790,
        top: 900,
        width: 25,
        height: 227,
        fill: '#40b4ff',
      },
      {
        text: `Life's Good`,
        left: 540,
        top: 2080,
        fontSize: 24,
        fontFamily: 'Arial Black',
        fill: '#f67ac6',
        type: 'text',
        objectType: 'text'
      },
    ]
  },
  {
    name: 'sakura',
    elements: [
      {
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/illustrations/sakura.png', // Only for reference
        left: 30,
        top: 420,
        scaleX: 1,
        scaleY: 1,
        selectable: true,
        objectCaching: false,
      },
      {
        text: 'SAKURA',
        left: 290,
        top: 1080,
        fontSize: 60,
        fontFamily: 'Old English Text MT',
        fill: '#FFFFFF',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'SAKURA',
        left: 290,
        top: 1380,
        fontSize: 60,
        fontFamily: 'Old English Text MT',

        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'SAKURA',
        left: 290,
        top: 1680,
        fontSize: 60,
        fontFamily: 'Old English Text MT',

        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text'
      }
    ]
  },
  {
    name: 'monaliza',
    elements: [
      {
        type: 'text',
        text: 'MONALIZA',
        left: 260,
        top: 50,
        fontSize: 60,
        fontFamily: 'NightRumble',
        fill: '#FFC300',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
      {
        text: 'MONALIZA',
        left: 260,
        top: 200,
        fontSize: 60,
        fontFamily: 'NightRumble',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text',
        textheight: 45,
      },
      {
        text: 'MONALIZA',
        left: 260,
        top: 320,
        fontSize: 60,
        fontFamily: 'NightRumble',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text',
        textheight: 40,
      },
      {
        text: 'MONALIZA',
        left: 260,
        top: 420,
        fontSize: 60,
        fontFamily: 'NightRumble',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text',
        textheight: 35,
      },
      {
        text: 'MONALIZA',
        left: 260,
        top: 460,
        fontSize: 60,
        fontFamily: 'NightRumble',
        fill: 'transparent',
        strokeWidth: 20,
        stroke: 'white',
        textAlign: 'center',
        charSpacing: 0,
        lineHeight: 1,
        type: 'text',
        objectType: 'text',
        textheight: 25,
      },
      {
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/images/monaliza.png', // Only for reference
        left: 220,
        top: 820,
        scaleX: 1,
        scaleY: 1,
        selectable: true,
        objectCaching: false,
      },
      {
        type: 'text',
        text: 'Portrait of Mrs.Lisa del Giocondo.',
        left: 170,
        top: 2400,
        fontSize: 22,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'Mona Lisa, also known as La Gioconda,',
        left: 450,
        top: 2600,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'A portrait by Leonardo da Vinci, painted around 1503–1505.',
        left: 170,
        top: 2670,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'It likely shows Lisa Gherardini, wife of a Florentine merchant.',
        left: 160,
        top: 2740,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'Today, the painting is displayed in the Louvre Museum in Paris.',
        left: 150,
        top: 2810,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        objectType: 'text',
        charSpacing: 0,
        lineHeight: 1,
        textAlign: 'center',
      }
    ]
  },


  //uno
  {
    name: 'heatWave',
    elements: [
      {
        text: 'Heat Wave!',
        left: 120,
        top: 220,
        fontSize: 56,
        fontStyle: 'italic',
        fontFamily: 'Arial Black',
        fill: 'white',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text',
        opacity: 0.3,
      },
      {
        text: 'Too hot to blend in.',
        left: 480,
        top: 1250,
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text'
      },
      {
        text: 'Heat Wave!',
        left: 120,
        top: 320,
        fontSize: 56,
        fontStyle: 'italic',
        fontFamily: 'Arial Black',
        fill: 'white',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text',
        opacity: 0.6,
      },
      {
        text: 'Heat Wave!',
        left: 120,
        top: 420,
        fontSize: 56,
        fontStyle: 'italic',
        fontFamily: 'Arial Black',
        fill: 'white',
        textAlign: 'left',
        lineHeight: 1.2,
        type: 'text',
        objectType: 'text',
        opacity: 0.8,
      },
      {
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/tree.png', // Only for reference
        left: 820,
        top: 820,
        scaleX: 0.2,
        scaleY: 0.2,
        selectable: true,
        objectCaching: false,
        name: 'tree'
      },
      {
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/tree.png', // Only for reference
        left: 1140,
        top: 820,
        scaleX: 0.15,
        scaleY: 0.15,
        selectable: true,
        objectCaching: false,
        name: 'tree'
      },
      {
        type: 'shape',
        objectType: 'image',
        url: 'assets/Shapes/cliparts/tree.png', // Only for reference
        left: 570,
        top: 820,
        scaleX: 0.15,
        scaleY: 0.15,
        selectable: true,
        objectCaching: false,
        name: 'tree'
      },
    ]
  },
  {
    name: 'immature',
    elements: [
      {
        type: 'text',
        text: 'Immature',
        fontFamily: 'Impact', // or 'Anton' or any bold condensed font
        fontSize: 60,
        fill: 'black',
        left: 270,
        top: 100
      },
      {
        type: 'text',
        text: ': (adj.)',
        fontFamily: 'Georgia', // or 'Times New Roman'
        fontSize: 24,
        fontStyle: 'italic',
        fill: 'black',
        left: 160,
        top: 550
      },
      {
        type: 'text',
        text: 'A word used by boring people ',
        fontFamily: 'Georgia',
        fontSize: 24,
        fill: 'black',
        left: 250,
        top: 750,
        lineHeight: 1.3,
        textAlign: 'left'
      },
      {
        type: 'text',
        text: 'to describe fun people.',
        fontFamily: 'Georgia',
        fontSize: 24,
        fill: 'black',
        left: 250,
        top: 950,
        lineHeight: 1.3,
        textAlign: 'left'
      }
    ]
  },
  {
    name: 'mustang',
    elements: [
      {
        type: 'text',
        text: 'MUSTANG  ',
        fontFamily: 'Orbitron',
        fontSize: 60,
        fill: 'white',
        left: 90,
        top: 750,
        lineHeight: 1,
        charspacing: 1,
        selectable: true,
      },
      {
        type: 'image',
        objectType: 'image',
        url: 'assets/Shapes/illustrations/mustang.png', // Only for reference
        left: 500,
        top: 420,
        scaleX: 1,
        scaleY: 1,
        selectable: true,
        lineHeight: 1.2,
        charspacing: 0,
        objectCaching: false,
      },
    ]
  }
];

export const grids = [
  { id: 1, name: 'Area', url: 'assets/Shapes/grids/Area.png' },
  { id: 2, name: 'simple', url: 'assets/Shapes/grids/simple.png' },
  { id: 2, name: 'center_box', url: 'assets/Shapes/grids/center_box.png' },
  { id: 3, name: 'distorted_center_area', url: 'assets/Shapes/grids/distorted_center_area.png' },
  { id: 4, name: 'distorted', url: 'assets/Shapes/grids/distorted.png' },
]


export const shapeTemplates = [
  {
    id: 'basic_rect',
    elements: [{
      objectType: 'shape',
      type: 'rect',
      left: 50,
      top: 20,
      width: 10,
      height: 10,
      fill: '#FF6F61',
      stroke: '#333',
      strokeWidth: 0,
    }]
  },
  {
    id: 'basic_circle',
    elements: [{
      objectType: 'shape',
      type: 'circle',
      left: 50,
      top: 20,
      radius: 5,
      fill: '#6B5B95',
      stroke: '#333',
      strokeWidth: 0,
    }],
  },
  {
    id: 'basic_triangle',
    elements: [{
      objectType: 'shape',
      type: 'triangle',
      left: 50,
      top: 20,
      width: 10,
      height: 10,
      fill: '#88B04B',
      stroke: '#333',
      strokeWidth: 0,
    }],
  }
];
