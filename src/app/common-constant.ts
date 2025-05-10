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


export const titleTextTemplates = [
  {
    id: 'bold_artist_quote',
    elements: [
      {
        type: 'textbox',
        objectType: 'text',
        text: "I'M NOT",
        fontFamily: 'Anton',
        fontSize: 70,
        fontWeight: 'bold',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4,
        textAlign: 'center',
        top: 0,
        left: 0,
        width: 350,
        lineHeight: 1,
      },
      {
        type: 'textbox',
        objectType: 'text',
        text: 'WEIRD',
        fontFamily: 'Anton',
        fontSize: 70,
        fontWeight: 'bold',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4,
        textAlign: 'center',
        top: 80,
        left: 0,
        width: 350,
        lineHeight: 1,
      },
      {
        type: 'textbox',
        objectType: 'text',
        text: "I'M AN",
        fontFamily: 'Anton',
        fontSize: 70,
        fontWeight: 'bold',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4,
        textAlign: 'center',
        top: 160,
        left: 0,
        width: 350,
        lineHeight: 1,
      },
      {
        type: 'textbox',
        objectType: 'text',
        text: 'ARTIST',
        fontFamily: 'Anton',
        fontSize: 70,
        fontWeight: 'bold',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4,
        textAlign: 'center',
        top: 240,
        left: 0,
        width: 350,
        lineHeight: 1,
      }
    ]
  },
  {
    id: 'createefi_fashion_express',
    elements: [
      { text: 'Createefi', left: 30, top: 10, fontSize: 28, fontFamily: 'Dancing Script', fontStyle: 'italic', type: 'text' },
      { text: 'FASHION', left: 8, top: 30, fontSize: 30, fill: 'transparent', stroke: 'black', strokeWidth: 2, fontWeight: '', type: 'text' },
      { text: 'EXPRESS YOUR STYLE!', left: 15, top: 60, fontSize: 10, fill: 'black', fontWeight: 'bold', type: 'text' }
    ]
  },
  {
    id: 'createefi_vibes_unleash',
    elements: [
      { text: 'Createefi', left: 20, top: 5, fontSize: 28, fontFamily: 'Great Vibes', fontStyle: 'italic', fill: '#3B3B98', type: 'text' },
      { text: 'VIBES', left: 10, top: 25, fontSize: 40, fill: 'transparent', stroke: '#3B3B98', strokeWidth: 3, fontWeight: 'bold', type: 'text' },
      { text: 'UNLEASH YOUR STYLE!', left: 2, top: 65, fontSize: 12, fill: '#3B3B98', fontWeight: 'bold', letterSpacing: 2, type: 'text' }
    ]
  },
  {
    id: 'createefi_identity_define',
    elements: [
      { text: 'Createefi', left: 15, top: 10, fontSize: 28, fontFamily: 'Parisienne', fontStyle: 'italic', fill: '#E63946', type: 'text' },
      { text: 'IDENTITY', left: 5, top: 35, fontSize: 25, fill: 'transparent', stroke: '#E63946', strokeWidth: 2, fontWeight: 'bold', type: 'text' },
      { text: 'DEFINE YOURSELF TODAY!', left: 4, top: 60, fontSize: 10, fill: '#E63946', fontWeight: 'bold', letterSpacing: 2, type: 'text' }
    ]
  },
  {
    id: 'quit_smoking',
    elements: [
      // Red Background Box
      {
        type: 'rect',
        left: 30,
        top: 10,
        width: 40,
        height: 80,
        fill: '#E63946'
      },

      // Vertical Text in Red Box
      { text: 'QU', left: 52, top: 10, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'TA', left: 54, top: 25, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'AN', left: 53, top: 40, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'ST', left: 55, top: 55, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'DO', left: 51, top: 70, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },

      // White Text on the Right
      { text: 'IT', left: 71, top: 10, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'LKING', left: 71, top: 25, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'D', left: 71, top: 40, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'ART', left: 71, top: 55, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' },
      { text: 'ING', left: 71, top: 70, fontSize: 12, fill: 'black', fontWeight: 'bold', type: 'text' }
    ]
  },
]

export const bodyTextTemplates = [
  {
    id: "blockbuster_template",
    elements: [
      {
        text: "BLOCK",
        left: 10,
        top: 20,
        fontSize: 30,
        strokeWidth: 2,
        fontFamily: "Impact, sans-serif",
        effect: "blockbuster", type: 'text'
      },
      {
        text: "BUSTER",
        left: 25,
        top: 50,
        fontSize: 30,
        strokeWidth: 2,
        fontFamily: "Impact",
        effect: "blockbuster", type: 'text'
      }
    ]
  },
  {
    id: 'striped_abc_template',
    elements: [
      {
        text: 'ABC', left: 15, top: 20, fontSize: 50,
        fontFamily: 'Arial Black', fill: 'black', type: 'text',
        strokeWidth: 2,
        pattern: { type: 'horizontal_stripes', stripeHeight: 5, stripeSpacing: 5, stripeColor: 'black', backgroundColor: 'white' }
      }
    ]
  },
  {
    id: 'comic_text_template',
    elements: [
      {
        text: 'COMIC', left: 18, top: 34, fontSize: 30,
        fontFamily: 'Comic Sans MS', fill: 'white',
        stroke: 'black', strokeWidth: 2,
        shadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
        fontWeight: 'bold', type: 'text'
      }
    ]
  },
  {
    "id": "pixelated_2000_template",
    elements: [
      {
        text: 'pixel',
        left: 20,
        top: 40,
        fontSize: 24,
        fill: '#00cc00', // Bright green color
        stroke: '#003300', // Dark green outline for pixelated effect
        strokeWidth: 2,
        fontFamily: 'Press Start 2P',
        type: 'text',
        shadow: {
          color: '#003300',
          blur: 0,
          offsetX: 3,
          offsetY: 3
        }
      }
    ]
  },
  {
    id: 'holiday_text_template',
    elements: [
      {
        text: 'Cyberpunk',
        left: 20,
        top: 40,
        fontSize: 16,
        fill: '#d32f2f', // Deep red color
        stroke: '#8B0000', // Darker red stroke for depth
        strokeWidth: 1,
        fontFamily: 'StarKillers', // Vintage font style
        type: 'text',
        shadow: [
          {
            color: '#5c0000', // Deep shadow
            blur: 0,
            offsetX: 3,
            offsetY: 3
          },
          {
            color: '#fff', // Inner highlight for embossed look
            blur: 0,
            offsetX: -2,
            offsetY: -2
          }
        ]
      }
    ]
  }
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
