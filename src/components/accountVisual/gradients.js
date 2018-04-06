import React from 'react';

const gradSpecs = [
  {
    primary: [{
      id: 'chic-BG',
      colors: ['#FF89B4', '#BA019C'],
      rotate: -225,
    },
    {
      id: 'chic-FG',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    }],
    secondary: [{
      id: 'chic-1',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }, {
      id: 'chic-2',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -225,
    }, {
      id: 'chic-3',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'chic-4',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'gaugin-BG',
      colors: ['#0076EB', '#001756'],
      rotate: -225,
    },
    {
      id: 'gaugin-FG',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    }],
    secondary: [{
      id: 'gaugin-1',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    }, {
      id: 'gaugin-2',
      colors: ['#305C96', '#000916'],
      rotate: -225,
    }, {
      id: 'gaugin-3',
      colors: ['#009756', '#6BF6BA'],
      rotate: -45,
    }, {
      id: 'gaugin-4',
      colors: ['#A3B6FF', '#4332E8'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'schiaparelli-BG',
      colors: ['#93FEFF', '#3A85E4'],
      rotate: -225,
    },
    {
      id: 'schiaparelli-FG',
      colors: ['#9B1568', '#0D0707'],
      rotate: -225,
    }],
    secondary: [{
      id: 'schiaparelli-1',
      colors: ['#FFF6B8', '#FFAE19'],
      rotate: -225,
    }, {
      id: 'schiaparelli-2',
      colors: ['#FF7BA7', '#FFE1EB'],
      rotate: -45,
    }, {
      id: 'schiaparelli-3',
      colors: ['#C01E1D', '#FF43A5'],
      rotate: -27,
    }, {
      id: 'schiaparelli-4',
      colors: ['#405467', '#00023C'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'brombeere-BG',
      colors: ['#840AD6', '#4D04AD'],
      rotate: -225,
    },
    {
      id: 'brombeere-FG',
      colors: ['#F792A6', '#EC596D'],
      rotate: -225,
    }],
    secondary: [{
      id: 'brombeere-1',
      colors: ['#C747BB', '#962286'],
      rotate: -225,
    }, {
      id: 'brombeere-2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'brombeere-3',
      colors: ['#D8AADF', '#B071BC'],
      rotate: -255,
    }, {
      id: 'brombeere-4',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  },
  {
    primary: [{
      id: 'ciro-BG',
      colors: ['#1E4B54', '#020C08'],
      rotate: -225,
    },
    {
      id: 'ciro-FG',
      colors: ['#FFFDCB', '#FFFD63'],
      rotate: -225,
    }],
    secondary: [{
      id: 'ciro-1',
      colors: ['#E3FFFF', '#85EFB7'],
      rotate: -225,
    }, {
      id: 'ciro-2',
      colors: ['#FFF264', '#FFD064'],
      rotate: -225,
    }, {
      id: 'ciro-3',
      colors: ['#E0FFE3', '#749684'],
      rotate: -255,
    }, {
      id: 'ciro-4',
      colors: ['#FFC95A', '#D75A19'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'capri-BG',
      colors: ['#FFD300', '#FF9100'],
      rotate: -225,
    },
    {
      id: 'capri-FG',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    }],
    secondary: [{
      id: 'capri-1',
      colors: ['#92BEFF', '#598AFF'],
      rotate: -225,
    }, {
      id: 'capri-2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'capri-3',
      colors: ['#E2E7FF', '#C1CBFF'],
      rotate: -255,
    }, {
      id: 'capri-4',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  },
  {
    primary: [{
      id: 'sevenseas-BG',
      colors: ['#122037', '#243847'],
      rotate: -45,
    },
    {
      id: 'sevenseas-FG',
      colors: ['#7192B9', '#3A5E89'],
      rotate: -225,
    }],
    secondary: [{
      id: 'sevenseas-1',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -225,
    }, {
      id: 'sevenseas-2',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -225,
    }, {
      id: 'sevenseas-3',
      colors: ['#95D425', '#33B200'],
      rotate: -255,
    }, {
      id: 'sevenseas-4',
      colors: ['#00B491', '#007D58'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'neo-BG',
      colors: ['#48FFFF', '#006BA2'],
      rotate: -225,
    },
    {
      id: 'neo-FG',
      colors: ['#FFFEF9', '#FFF1AC'],
      rotate: -225,
    }],
    secondary: [{
      id: 'neo-1',
      colors: ['#580049', '#E764FF'],
      rotate: -45,
    }, {
      id: 'neo-2',
      colors: ['#64CFFF', '#00417A'],
      rotate: -225,
    }, {
      id: 'neo-3',
      colors: ['#0E183A', '#7599BF'],
      rotate: -45,
    }, {
      id: 'neo-4',
      colors: ['#FF3271', '#FFBCB7'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'surfwear-BG',
      colors: ['#DCFFF4', '#00A6AC'],
      rotate: -225,
    },
    {
      id: 'surfwear-FG',
      colors: ['#FFEFCA', '#FFD600'],
      rotate: -225,
    }],
    secondary: [{
      id: 'surfwear-1',
      colors: ['#55E5FF', '#004AC6'],
      rotate: -225,
    }, {
      id: 'surfwear-2',
      colors: ['#FFA7C3', '#AC00C6'],
      rotate: -225,
    }, {
      id: 'surfwear-3',
      colors: ['#2F9800', '#E8FFA3'],
      rotate: -45,
    }, {
      id: 'surfwear-4',
      colors: ['#F4EAFF', '#C575EB'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'pistachio-BG',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -225,
    },
    {
      id: 'pistachio-FG',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    }],
    secondary: [{
      id: 'pistachio-1',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    }, {
      id: 'pistachio-2',
      colors: ['#00C0FF', '#004DFF'],
      rotate: -225,
    }, {
      id: 'pistachio-3',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'pistachio-4',
      colors: ['#00DABE', '#00B38A'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'emerald-BG',
      colors: ['#C5FFBD', '#1BA183'],
      rotate: -225,
    },
    {
      id: 'emerald-FG',
      colors: ['#416B87', '#000D15'],
      rotate: -225,
    }],
    secondary: [{
      id: 'emerald-1',
      colors: ['#FDFFA8', '#FFF8E4'],
      rotate: -225,
    }, {
      id: 'emerald-2',
      colors: ['#FFF8C1', '#FDFD00'],
      rotate: -225,
    }, {
      id: 'emerald-3',
      colors: ['#FFC131', '#FF7F35'],
      rotate: -45,
    }, {
      id: 'emerald-4',
      colors: ['#FFB9DE', '#FFFFFF'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'raspberry-BG',
      colors: ['#86003E', '#CE2573'],
      rotate: -225,
    },
    {
      id: 'raspberry-FG',
      colors: ['#F9F9F4', '#F1F1E6'],
      rotate: -225,
    }],
    secondary: [{
      id: 'raspberry-1',
      colors: ['#4C72FF', '#06009D'],
      rotate: -225,
    }, {
      id: 'raspberry-2',
      colors: ['#FFF8CF', '#FFD23A'],
      rotate: -225,
    }, {
      id: 'raspberry-3',
      colors: ['#93FEFF', '#3A85E4'],
      rotate: -255,
    }, {
      id: 'raspberry-4',
      colors: ['#FFD11E', '#FF7500'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'tropical-BG',
      colors: ['#023D49', '#010505'],
      rotate: -225,
    },
    {
      id: 'tropical-FG',
      colors: ['#FFF8CF', '#FFD23A'],
      rotate: -225,
    }],
    secondary: [{
      id: 'tropical-1',
      colors: ['#FFCB40', '#FF7500'],
      rotate: -225,
    }, {
      id: 'tropical-2',
      colors: ['#E3391B', '#58000E'],
      rotate: -225,
    }, {
      id: 'tropical-3',
      colors: ['#E1FF9A', '#347C07'],
      rotate: -255,
    }, {
      id: 'tropical-4',
      colors: ['#00B685', '#113034'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'hub-BG',
      colors: ['#000E2F', '#005891'],
      rotate: -45,
    },
    {
      id: 'hub-FG',
      colors: ['#F3FEFF', '#CEFAFF'],
      rotate: -45,
    }],
    secondary: [{
      id: 'hub-1',
      colors: ['#FCFFC1', '#FFB800'],
      rotate: -225,
    }, {
      id: 'hub-2',
      colors: ['#FF6236', '#C80039'],
      rotate: -225,
    }, {
      id: 'hub-3',
      colors: ['#B1FFFF', '#00B6DA'],
      rotate: -255,
    }, {
      id: 'hub-4',
      colors: ['#D9FF8B', '#00B371'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'kutter-BG',
      colors: ['#17499B', '#3C7FB4'],
      rotate: -45,
    },
    {
      id: 'kutter-FG',
      colors: ['#A3C2E6', '#3C5068'],
      rotate: -225,
    }],
    secondary: [{
      id: 'kutter-1',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -225,
    }, {
      id: 'kutter-2',
      colors: ['#96F7E1', '#5DECBF'],
      rotate: -225,
    }, {
      id: 'kutter-3',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -255,
    }, {
      id: 'kutter-4',
      colors: ['#00B491', '#007D58'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'icecandy-BG',
      colors: ['#4FFFE5', '#009ED9'],
      rotate: -225,
    },
    {
      id: 'icecandy-FG',
      colors: ['#40648D', '#0D141D'],
      rotate: -225,
    }],
    secondary: [{
      id: 'icecandy-1',
      colors: ['#C0FF8F', '#3DA000'],
      rotate: -225,
    }, {
      id: 'icecandy-2',
      colors: ['#FFEFAD', '#FFAB00'],
      rotate: -225,
    }, {
      id: 'icecandy-3',
      colors: ['#A3B6FF', '#4332E8'],
      rotate: -255,
    }, {
      id: 'icecandy-4',
      colors: ['#F5FEFF', '#94D3E9'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'urbangarden-BG',
      colors: ['#40648D', '#0D141D'],
      rotate: -225,
    },
    {
      id: 'urbangarden-FG',
      colors: ['#CAFF8F', '#0B4E04'],
      rotate: -225,
    }],
    secondary: [{
      id: 'urbangarden-1',
      colors: ['#FFD974', '#FF7F00'],
      rotate: -225,
    }, {
      id: 'urbangarden-2',
      colors: ['#FFF387', '#FFB400'],
      rotate: -225,
    }, {
      id: 'urbangarden-3',
      colors: ['#00454E', '#22EFB9'],
      rotate: -45,
    }, {
      id: 'urbangarden-4',
      colors: ['#E1F8FF', '#51727C'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'fifties-BG',
      colors: ['#BDFCFF', '#0085DC'],
      rotate: -225,
    },
    {
      id: 'fifties-FG',
      colors: ['#F8E6FF', '#FFA8E8'],
      rotate: -225,
    }],
    secondary: [{
      id: 'fifties-1',
      colors: ['#FBFFDA', '#FFEB69'],
      rotate: -225,
    }, {
      id: 'fifties-2',
      colors: ['#F9FFFF', '#A3CDCC'],
      rotate: -225,
    }, {
      id: 'fifties-3',
      colors: ['#ADC9B0', '#000B42'],
      rotate: -255,
    }, {
      id: 'fifties-4',
      colors: ['#006DE6', '#000810'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'bubbletea-BG',
      colors: ['#48FFFF', '#006BA2'],
      rotate: -225,
    },
    {
      id: 'bubbletea-FG',
      colors: ['#FFF4CA', '#F0CF2E'],
      rotate: -225,
    }],
    secondary: [{
      id: 'bubbletea-1',
      colors: ['#580049', '#E764FF'],
      rotate: -45,
    }, {
      id: 'bubbletea-2',
      colors: ['#006A6A', '#000000'],
      rotate: -225,
    }, {
      id: 'bubbletea-3',
      colors: ['#D455BF', '#FFCAF6'],
      rotate: -45,
    }, {
      id: 'bubbletea-4',
      colors: ['#FF90D2', '#FF096C'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'loriot-BG',
      colors: ['#D876FF', '#A142D5'],
      rotate: -225,
    },
    {
      id: 'loriot-FG',
      colors: ['#7B56FF', '#4029B8'],
      rotate: -225,
    }],
    secondary: [{
      id: 'loriot-1',
      colors: ['#00C0FF', '#004DFF'],
      rotate: -225,
    }, {
      id: 'loriot-2',
      colors: ['#FF89B4', '#BA019C'],
      rotate: -225,
    }, {
      id: 'loriot-3',
      colors: ['#53C7FF', '#1B97FF'],
      rotate: -255,
    }, {
      id: 'loriot-4',
      colors: ['#FFCF20', '#FF5C00'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'mondino-BG',
      colors: ['#7DA2C7', '#EAF4FF'],
      rotate: -45,
    },
    {
      id: 'mondino-FG',
      colors: ['#232D24', '#000000'],
      rotate: -225,
    }],
    secondary: [{
      id: 'mondino-1',
      colors: ['#FF6236', '#C80039'],
      rotate: -225,
    }, {
      id: 'mondino-2',
      colors: ['#76909D', '#000F16'],
      rotate: -225,
    }, {
      id: 'mondino-3',
      colors: ['#092139', '#6DAEF0'],
      rotate: -45,
    }, {
      id: 'mondino-4',
      colors: ['#FFEDCC', '#FFB021'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'frosty-BG',
      colors: ['#0083B2', '#0EC2C3'],
      rotate: -225,
    },
    {
      id: 'frosty-FG',
      colors: ['#F5FEFF', '#94D3E9'],
      rotate: -225,
    }],
    secondary: [{
      id: 'frosty-1',
      colors: ['#E8F6FF', '#00CEC8'],
      rotate: -225,
    }, {
      id: 'frosty-2',
      colors: ['#FFF387', '#00CEC8'],
      rotate: -225,
    }, {
      id: 'frosty-3',
      colors: ['#FF92A1', '#CA0053'],
      rotate: -255,
    }, {
      id: 'frosty-4',
      colors: ['#FFD974', '#FF7F00'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'kopenhagen-BG',
      colors: ['#FFFFFF', '#BCBAB7'],
      rotate: -225,
    },
    {
      id: 'kopenhagen-FG',
      colors: ['#000E2F', '#005891'],
      rotate: -45,
    }],
    secondary: [{
      id: 'kopenhagen-1',
      colors: ['#FFCF20', '#FF5C00'],
      rotate: -225,
    }, {
      id: 'kopenhagen-2',
      colors: ['#FFE696', '#FFA400'],
      rotate: -225,
    }, {
      id: 'kopenhagen-3',
      colors: ['#00EDFF', '#008BFF'],
      rotate: -255,
    }, {
      id: 'kopenhagen-4',
      colors: ['#0076EB', '#001756'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'icecreamvan-BG',
      colors: ['#93FEFF', '#3A85E4'],
      rotate: -225,
    },
    {
      id: 'icecreamvan-FG',
      colors: ['#05007B', '#9D99FF'],
      rotate: -45,
    }],
    secondary: [{
      id: 'icecreamvan-1',
      colors: ['#FFFFFF', '#C5C5C5'],
      rotate: -225,
    }, {
      id: 'icecreamvan-2',
      colors: ['#FFD11E', '#FF7500'],
      rotate: -225,
    }, {
      id: 'icecreamvan-3',
      colors: ['#FFEDCC', '#FFB021'],
      rotate: -255,
    }, {
      id: 'icecreamvan-4',
      colors: ['#580049', '#E764FF'],
      rotate: -45,
    }],
  },
  {
    primary: [{
      id: 'honeyberry-BG',
      colors: ['#FAD961', '#F76B1C'],
      rotate: -225,
    },
    {
      id: 'honeyberry-FG',
      colors: ['#3023AE', '#C86DD7'],
      rotate: -45,
    }],
    secondary: [{
      id: 'honeyberry-1',
      colors: ['#3023AE', '#53A0FD'],
      rotate: -45,
    }, {
      id: 'honeyberry-2',
      colors: ['#4D3AFF', '#8480FF'],
      rotate: -45,
    }, {
      id: 'honeyberry-3',
      colors: ['#93FEFF', '#3A85E4'],
      rotate: -255,
    }, {
      id: 'honeyberry-4',
      colors: ['#E3B8FF', '#F6E8FF'],
      rotate: -45,
    }],
  },
  {
    primary: [{
      id: 'marshmallow-BG',
      colors: ['#FFF0F0', '#FFE9F9'],
      rotate: -225,
    },
    {
      id: 'marshmallow-FG',
      colors: ['#FFBFCA', '#FFE7EB'],
      rotate: -225,
    }],
    secondary: [{
      id: 'marshmallow-1',
      colors: ['#FFE3E6', '#FF2E5F'],
      rotate: -225,
    }, {
      id: 'marshmallow-2',
      colors: ['#FCFFC1', '#FFB800'],
      rotate: -225,
    }, {
      id: 'marshmallow-3',
      colors: ['#EBF7FF', '#6EC8FF'],
      rotate: -255,
    }, {
      id: 'marshmallow-4',
      colors: ['#E3FFFF', '#39D181'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'peyton-BG',
      colors: ['#FFE0D9', '#FFE5EE'],
      rotate: -225,
    },
    {
      id: 'peyton-FG',
      colors: ['#20457F', '#04121F'],
      rotate: -225,
    }],
    secondary: [{
      id: 'peyton-1',
      colors: ['#A7C8FF', '#26456E'],
      rotate: -225,
    }, {
      id: 'peyton-2',
      colors: ['#FFFFFF', '#C5C5C5'],
      rotate: -225,
    }, {
      id: 'peyton-3',
      colors: ['#FFAD8B', '#D1001F'],
      rotate: -255,
    }, {
      id: 'peyton-4',
      colors: ['#FFFFF5', '#FFCE7B'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'marzipan-BG',
      colors: ['#D4A0FF', '#ECEEFF'],
      rotate: -45,
    },
    {
      id: 'marzipan-FG',
      colors: ['#CAFF8F', '#0B4E04'],
      rotate: -225,
    }],
    secondary: [{
      id: 'marzipan-1',
      colors: ['#FFCF20', '#FF5C00'],
      rotate: -225,
    }, {
      id: 'marzipan-2',
      colors: ['#FCFFC1', '#FFB800'],
      rotate: -225,
    }, {
      id: 'marzipan-3',
      colors: ['#00454E', '#22EFB9'],
      rotate: -45,
    }, {
      id: 'marzipan-4',
      colors: ['#E1F8FF', '#51727C'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'rebel-BG',
      colors: ['#FFFFFF', '#BCBAB7'],
      rotate: -225,
    },
    {
      id: 'rebel-FG',
      colors: ['#05387A', '#010F20'],
      rotate: -225,
    }],
    secondary: [{
      id: 'rebel-1',
      colors: ['#FFBBB2', '#CA0000'],
      rotate: -225,
    }, {
      id: 'rebel-2',
      colors: ['#FF7F5D', '#FFF0E9'],
      rotate: -45,
    }, {
      id: 'rebel-3',
      colors: ['#CBFFF1', '#01C28D'],
      rotate: -255,
    }, {
      id: 'rebel-4',
      colors: ['#00FFE8', '#005E56'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'rishon-BG',
      colors: ['#FFFFFF', '#BCBAB7'],
      rotate: -225,
    },
    {
      id: 'rishon-FG',
      colors: ['#6A4F3C', '#170B0B'],
      rotate: -225,
    }],
    secondary: [{
      id: 'rishon-1',
      colors: ['#FFE696', '#FFA400'],
      rotate: -225,
    }, {
      id: 'rishon-2',
      colors: ['#FFFDF5', '#FFCE8C'],
      rotate: -225,
    }, {
      id: 'rishon-3',
      colors: ['#628FAC', '#000000'],
      rotate: -255,
    }, {
      id: 'rishon-4',
      colors: ['#FF6933', '#9B0202'],
      rotate: -225,
    }],
  },
  {
    primary: [{
      id: 'ultra-BG',
      colors: ['#F3F3F3', '#8C8C8C'],
      rotate: -225,
    },
    {
      id: 'ultra-FG',
      colors: ['#20457F', '#04121F'],
      rotate: -225,
    }],
    secondary: [{
      id: 'ultra-1',
      colors: ['#66FFFF', '#0076B3'],
      rotate: -225,
    }, {
      id: 'ultra-2',
      colors: ['#FFA1D7', '#D700A6'],
      rotate: -225,
    }, {
      id: 'ultra-3',
      colors: ['#F9FFCE', '#FFD300'],
      rotate: -255,
    }, {
      id: 'ultra-4',
      colors: ['#09005E', '#5C68FF'],
      rotate: -45,
    }],
  },
];

const addUrl = spec => ({
  ...spec,
  url: `url(#${spec.id})`,
});

export const gradientSchemes = gradSpecs.map(spec => ({
  primary: spec.primary.map(addUrl),
  secondary: spec.secondary.map(addUrl),
}));

export const Gradients = ({ scheme }) => (
  <defs>
    {[...scheme.primary, ...scheme.secondary].map(spec => (
      <linearGradient id={spec.id} key={spec.id} gradientTransform={`rotate(${spec.rotate})`}>
        {spec.colors.map((color, i) => (
          <stop stopColor={color} offset={`${i * (100 / (spec.colors.length - 1))}%`} key={i}/>
        ))}
      </linearGradient>
    ))}
  </defs>
);
