"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { CoverArtVariant } from "@/content/projects/_schema";

interface ProjectCoverProps {
  variant: CoverArtVariant;
  className?: string;
}

export function ProjectCover({ variant, className }: ProjectCoverProps) {
  const id = useId();
  const cover = COVERS[variant];
  if (!cover) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full overflow-hidden",
        "bg-gradient-to-br from-bg-tertiary to-bg-secondary",
        className
      )}
    >
      <svg
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        role="img"
      >
        {cover(id)}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-card/80 to-transparent pointer-events-none" />
    </div>
  );
}

type CoverRenderer = (id: string) => React.ReactNode;

const COVERS: Record<CoverArtVariant, CoverRenderer> = {
  "concept-intelligence": (id) => (
    <g>
      <defs>
        <linearGradient id={`cibg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1929" />
          <stop offset="50%" stopColor="#0f2a47" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>
        <radialGradient id={`ciglw-${id}`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <filter id={`cif-${id}`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="800" height="400" fill={`url(#cibg-${id})`} />
      <rect width="800" height="400" fill={`url(#ciglw-${id})`} />

      {/* Neural network grid */}
      <g opacity="0.4" filter={`url(#cif-${id})`}>
        {/* Vertical nodes with connecting lines */}
        {[100, 250, 400, 550, 700].map((cx, gi) => (
          <g key={`cg${gi}`}>
            <line x1={cx} y1="20" x2={cx} y2="380" stroke="#38bdf8" strokeWidth="0.5" opacity="0.08" />
            {[60, 120, 180, 240, 300, 360].map((cy, ni) => (
              <g key={`cn${gi}-${ni}`}>
                <circle cx={cx} cy={cy} r={2 + (ni % 3)} fill="#5eead4" opacity={0.3 + (ni % 4) * 0.1} />
                {gi < 4 && (
                  <line x1={cx} y1={cy} x2={cx + 150} y2={cy + (ni % 2 === 0 ? 30 : -30)} stroke="#38bdf8" strokeWidth="0.5" opacity={0.06 + (ni % 5) * 0.02} />
                )}
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Central concept graph */}
      <g transform="translate(400, 190)">
        {/* Concentric rings */}
        <circle cx="0" cy="0" r="80" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.12" strokeDasharray="4 6" />
        <circle cx="0" cy="0" r="55" fill="none" stroke="#5eead4" strokeWidth="0.6" opacity="0.15" strokeDasharray="2 4" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#818cf8" strokeWidth="0.5" opacity="0.2" />

        {/* Concept nodes */}
        {[
          { x: -60, y: -40, r: 6, c: "#38bdf8", o: 0.5 },
          { x: 50, y: -35, r: 5, c: "#5eead4", o: 0.4 },
          { x: -30, y: 50, r: 7, c: "#818cf8", o: 0.5 },
          { x: 60, y: 40, r: 4, c: "#38bdf8", o: 0.4 },
          { x: 0, y: -60, r: 8, c: "#5eead4", o: 0.6 },
          { x: -70, y: 20, r: 5, c: "#818cf8", o: 0.4 },
          { x: 40, y: 60, r: 4, c: "#38bdf8", o: 0.35 },
        ].map((n, i) => (
          <g key={`con${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r + 8} fill={n.c} opacity={n.o * 0.15} filter={`url(#cif-${id})`} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity={n.o} />
            <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill="#fff" opacity={n.o * 0.5} />
          </g>
        ))}

        {/* Central hub */}
        <circle cx="0" cy="0" r="12" fill="#38bdf8" opacity="0.2" filter={`url(#cif-${id})`} />
        <circle cx="0" cy="0" r="6" fill="#5eead4" opacity="0.6" />
        <circle cx="0" cy="0" r="2.5" fill="#fff" opacity="0.8" />
      </g>

      {/* Floating particles */}
      {Array.from({length: 30}, (_, i) => (
        <circle key={`p${i}`}
          cx={40 + Math.sin(i * 1.3) * 350 + 400}
          cy={30 + Math.cos(i * 0.9) * 160 + 100}
          r={1 + (i % 3)}
          fill={i % 3 === 0 ? "#38bdf8" : i % 3 === 1 ? "#5eead4" : "#818cf8"}
          opacity={0.1 + (i % 5) * 0.04}
        />
      ))}

      <text x="400" y="370" textAnchor="middle" fill="#5eead4"
        fontSize="12" fontFamily="ui-monospace,monospace"
        letterSpacing="4" opacity="0.5">
        DIAGNOSE · UNDERSTAND · MASTER
      </text>
    </g>
  ),

  "silicon-valley": (id) => (
    <g>
      <defs>
        <linearGradient id={`svbg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060d1a" />
          <stop offset="50%" stopColor="#0d1b2a" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </linearGradient>
        <linearGradient id={`svglow-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#svbg-${id})`} />
      <rect width="800" height="280" fill={`url(#svglow-${id})`} />

      {/* City skyline */}
      <g transform="translate(0, 130)" opacity="0.6">
        {[
          {x: 20, w: 30, h: 180}, {x: 55, w: 25, h: 120}, {x: 85, w: 35, h: 200},
          {x: 125, w: 20, h: 150}, {x: 150, w: 40, h: 220}, {x: 195, w: 28, h: 160},
          {x: 228, w: 32, h: 190}, {x: 265, w: 22, h: 130}, {x: 292, w: 38, h: 240},
          {x: 335, w: 25, h: 170}, {x: 365, w: 30, h: 210}, {x: 400, w: 35, h: 250},
          {x: 440, w: 22, h: 180}, {x: 467, w: 28, h: 140}, {x: 500, w: 34, h: 200},
          {x: 539, w: 26, h: 160}, {x: 570, w: 30, h: 230}, {x: 605, w: 24, h: 170},
          {x: 634, w: 36, h: 190}, {x: 675, w: 28, h: 150}, {x: 708, w: 32, h: 210},
          {x: 745, w: 25, h: 140}, {x: 775, w: 20, h: 100}
        ].map((b, i) => (
          <g key={`bld${i}`}>
            <rect x={b.x} y={270 - b.h} width={b.w} height={b.h}
              fill={`rgba(94,234,212,${0.03 + (i % 7) * 0.015})`}
              stroke="#5eead4" strokeWidth="0.3" opacity={0.15 + (i % 5) * 0.04} />
            {/* Windows */}
            {Array.from({length: Math.floor(b.h / 18)}, (_, j) => (
              <rect key={`w${i}-${j}`}
                x={b.x + b.w * 0.2} y={270 - b.h + j * 18 + 6}
                width={b.w * 0.6} height="5"
                fill="#5eead4" opacity={0.08 + Math.sin(i + j) * 0.05} rx="1" />
            ))}
            {/* Spire for tallest buildings */}
            {b.h > 200 && (
              <line x1={b.x + b.w / 2} y1={270 - b.h} x2={b.x + b.w / 2} y2={270 - b.h - 15}
                stroke="#5eead4" strokeWidth="0.5" opacity="0.2" />
            )}
          </g>
        ))}
      </g>

      {/* Data flow lines */}
      <g opacity="0.2">
        {[200, 300, 400, 500, 600].map((cx, i) => (
          <g key={`dfl${i}`}>
            <line x1={cx - 80} y1={50 + i * 20} x2={cx + 80} y2={50 + i * 20 + 40}
              stroke="#5eead4" strokeWidth="0.8" opacity={0.1 + i * 0.02} />
            <circle cx={cx} cy={62 + i * 30} r="2" fill="#5eead4" opacity={0.3 + i * 0.05} />
          </g>
        ))}
      </g>

      {/* Circuit traces */}
      <g opacity="0.08">
        <path d="M50,340 L200,340 L200,310 L350,310" stroke="#5eead4" strokeWidth="0.5" fill="none" />
        <path d="M450,310 L600,310 L600,340 L750,340" stroke="#5eead4" strokeWidth="0.5" fill="none" />
        <circle cx="200" cy="310" r="3" fill="#5eead4" opacity="0.3" />
        <circle cx="600" cy="310" r="3" fill="#5eead4" opacity="0.3" />
      </g>

      <text x="400" y="370" textAnchor="middle" fill="#5eead4"
        fontSize="12" fontFamily="ui-monospace,monospace"
        letterSpacing="4" opacity="0.5">
        INFRASTRUCTURE · AUTOMATION · SCALE
      </text>
    </g>
  ),



  "graph-visualizer": (id) => (
    <g>
      <defs>
        <linearGradient id={`gvbg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" /><stop offset="100%" stopColor="#120a1e" />
        </linearGradient>
        <filter id={`gvf-${id}`}><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <rect width="800" height="400" fill={`url(#gvbg-${id})`} />
      <g transform="translate(400,180)">
        {[...Array(12)].map((_,i)=>(
          <line key={`ge${i}`}
            x1={0} y1={0}
            x2={Math.cos(i*Math.PI/6)*100} y2={Math.sin(i*Math.PI/6)*100}
            stroke="#5eead4" strokeWidth="0.6" opacity={0.15+(i%4)*0.04} />
        ))}
        {[...Array(8)].map((_,i)=>{
          const a = i*Math.PI/4; const r=60+Math.sin(i*1.5)*20;
          return <circle key={`gn${i}`} cx={Math.cos(a)*r} cy={Math.sin(a)*r}
            r={3+Math.sin(i*2)*1.5} fill="#5eead4" opacity={0.3+(i%3)*0.1} />;
        })}
        <circle cx="0" cy="0" r="8" fill="#a78bfa" opacity="0.4" />
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#5eead4"
        fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.5">
        BFS · DFS · SHORTEST PATH
      </text>
    </g>
  ),

  "os-scheduling": (id) => (
    <g>
      <defs>
        <linearGradient id={`osbg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" /><stop offset="100%" stopColor="#141428" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#osbg-${id})`} />
      <g transform="translate(50,140)" opacity="0.5">
        <line x1="0" y1="0" x2="700" y2="0" stroke="#5eead4" strokeWidth="0.5" opacity="0.1" />
        {[{x:10,w:70,l:"P1",c:"#5eead4"},{x:85,w:55,l:"P2",c:"#a78bfa"},{x:145,w:90,l:"P3",c:"#818cf8"},{x:240,w:65,l:"P1",c:"#5eead4"},{x:310,w:80,l:"P4",c:"#f472b6"},{x:395,w:50,l:"P2",c:"#a78bfa"},{x:450,w:75,l:"P5",c:"#fb923c"},{x:530,w:60,l:"P3",c:"#818cf8"},{x:595,w:70,l:"P1",c:"#5eead4"},{x:670,w:25,l:"P4",c:"#f472b6"}].map((b,i)=>(
          <g key={`sg${i}`}>
            <rect x={b.x} y="-15" width={b.w} height="30" rx="4"
              fill={b.c} opacity="0.25" stroke={b.c} strokeWidth="0.3" />
            <text x={b.x+b.w/2} y="5" textAnchor="middle" fill={b.c}
              fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.6">{b.l}</text>
          </g>
        ))}
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#5eead4"
        fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.5">
        FCFS · SJF · ROUND ROBIN · PRIORITY
      </text>
    </g>
  ),

  "page-replacement": (id) => (
    <g>
      <defs>
        <linearGradient id={`prbg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1117" /><stop offset="100%" stopColor="#161b22" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#prbg-${id})`} />
      <g transform="translate(150,40)" opacity="0.4">
        {[0,1,2,3].map(row=>[0,1,2,3,4,5].map(col=>{
          const idx=row*4+col; const hc=idx<12; const act=idx===2||idx===6||idx===10;
          return (
            <g key={`pm${row}-${col}`}>
              <rect x={col*85} y={row*85} width="75" height="75" rx="5"
                fill={act?"#5eead4":"#141428"}
                stroke={act?"#5eead4":hc?"#a78bfa":"transparent"}
                strokeWidth={act?"1.2":"0.5"}
                opacity={act?0.4:hc?0.15:0.04} />
              {hc&&<text x={col*85+37} y={row*85+42} textAnchor="middle"
                fill={act?"#5eead4":"#a78bfa"} fontSize="9"
                fontFamily="ui-monospace,monospace"
                opacity={act?0.6:0.25}>P{idx+1}</text>}
            </g>
          );
        }))}
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#5eead4"
        fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.5">
        FIFO · LRU · OPTIMAL
      </text>
    </g>
  ),

  "darkroom": (id) => (
    <g>
      <defs>
        <linearGradient id={`drbg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a080a" />
          <stop offset="100%" stopColor="#0a0405" />
        </linearGradient>
        <radialGradient id={`drred-${id}`} cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#drbg-${id})`} />
      <rect width="800" height="400" fill={`url(#drred-${id})`} />
      {/* Framed photo print tray */}
      <g transform="translate(250, 80)">
        <rect x="0" y="0" width="300" height="200" rx="6" fill="#120608" stroke="#f43f5e" strokeWidth="1" opacity="0.4" />
        <rect x="20" y="20" width="260" height="160" rx="3" fill="#260c10" stroke="#f43f5e" strokeWidth="0.5" opacity="0.6" />
        <path d="M 40 140 Q 100 60, 160 110 T 260 80" fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.5" />
        <circle cx="160" cy="110" r="4" fill="#f43f5e" opacity="0.8" />
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#f43f5e" fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.6">
        ANALOG · RED SAFELIGHT · PHOTOGRAPHY
      </text>
    </g>
  ),

  "grove": (id) => (
    <g>
      <defs>
        <linearGradient id={`grbg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#041210" />
          <stop offset="100%" stopColor="#08211b" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#grbg-${id})`} />
      {/* Path curve */}
      <g opacity="0.5">
        <path d="M 100 350 C 250 250, 300 150, 500 120 T 700 60" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="6 4" />
        {[100, 220, 340, 460, 580, 700].map((cx, i) => (
          <circle key={`gw${i}`} cx={cx} cy={280 - i * 36} r="4" fill="#2dd4bf" opacity="0.7" />
        ))}
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.6">
        BIOLUMINESCENT · 3D GARDEN · PATHWAY
      </text>
    </g>
  ),

  "fracture": (id) => (
    <g>
      <defs>
        <linearGradient id={`frbg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#090a14" />
          <stop offset="100%" stopColor="#111322" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#frbg-${id})`} />
      {/* Crystal sphere with subtle light crack */}
      <g transform="translate(400, 180)">
        <circle cx="0" cy="0" r="70" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.4" />
        <circle cx="0" cy="0" r="68" fill="#818cf8" opacity="0.08" />
        <path d="M -30 -40 L 10 -10 L -5 20 L 35 50" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.8" />
      </g>
      <text x="400" y="370" textAnchor="middle" fill="#818cf8" fontSize="12" fontFamily="ui-monospace,monospace" letterSpacing="4" opacity="0.6">
        CRYSTAL · REFRACTION · GEOMETRY
      </text>
    </g>
  ),
};

export default ProjectCover;
