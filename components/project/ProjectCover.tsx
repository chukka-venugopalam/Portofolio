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
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        role="img"
      >
        {cover(id)}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-secondary/80 to-transparent pointer-events-none" />
    </div>
  );
}

type CoverRenderer = (id: string) => React.ReactNode;

const COVERS: Record<CoverArtVariant, CoverRenderer> = {
  "concept-intelligence": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0533" />
          <stop offset="50%" stopColor="#0d1b3e" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>
        <radialGradient id={`glw-${id}`} cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter id={`gf-${id}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="800" height="500" fill={`url(#bg-${id})`} />
      <rect width="800" height="500" fill={`url(#glw-${id})`} />
      <g opacity="0.6" filter={`url(#gf-${id})`}>
        {[[200,150,350,200],[350,200,500,150],[350,200,300,350],[350,200,450,320],[200,150,250,280],[500,150,550,280],[250,280,300,350],[550,280,450,320],[300,350,450,320],[200,150,100,220],[500,150,600,220]].map(([x1,y1,x2,y2],i)=>(
          <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i%2===0?"#a78bfa":"#5eead4"} strokeWidth="1.5"
            opacity={0.3+(i%3)*0.15} />
        ))}
        {[[200,150],[350,200],[500,150],[250,280],[300,350],[450,320],[550,280],[100,220],[600,220]].map(([cx,cy],i)=>(
          <circle key={`n${i}`} cx={cx} cy={cy} r={i<3?6:4}
            fill={i%2===0?"#a78bfa":"#5eead4"}
            opacity={0.6+(i%3)*0.13} />
        ))}
      </g>
      <g transform="translate(400,220)">
        <circle cx="0" cy="0" r="60" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.2" />
        <circle cx="0" cy="0" r="45" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="30" fill="none" stroke="#5eead4" strokeWidth="1" opacity="0.4" />
        <circle cx="0" cy="0" r="15" fill="#a78bfa" opacity="0.3" filter={`url(#gf-${id})`} />
      </g>
      {Array.from({length:20},(_,i)=>(
        <circle key={`p${i}`}
          cx={100+Math.sin(i*1.7)*300+400}
          cy={50+Math.cos(i*2.3)*180+150}
          r={1+(i%3)}
          fill={i%3===0?"#a78bfa":i%3===1?"#5eead4":"#818cf8"}
          opacity={0.2+(i%5)*0.08} />
      ))}
      <text x="400" y="440" textAnchor="middle" fill="#a78bfa"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        UNDERSTANDING &gt; MEMORIZATION
      </text>
    </g>
  ),
  "silicon-valley": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg2-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e27" /><stop offset="100%" stopColor="#0d1b2a" />
        </linearGradient>
        <linearGradient id={`cg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#bg2-${id})`} />
      <rect width="800" height="320" fill={`url(#cg-${id})`} />
      <g opacity="0.08">
        {Array.from({length:16},(_,i)=>(
          <line key={`vg${i}`} x1={i*50} y1="0" x2={i*50} y2="500" stroke="#5eead4" strokeWidth="0.5" />
        ))}
        {Array.from({length:10},(_,i)=>(
          <line key={`hg${i}`} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#5eead4" strokeWidth="0.5" />
        ))}
      </g>
      <g transform="translate(0,180)">
        {[{x:50,w:40,h:120},{x:100,w:30,h:180},{x:140,w:50,h:90},{x:200,w:35,h:200},{x:245,w:45,h:140},{x:300,w:25,h:220},{x:335,w:55,h:100},{x:400,w:40,h:200},{x:450,w:30,h:160},{x:490,w:50,h:110},{x:550,w:35,h:190},{x:595,w:45,h:130},{x:650,w:30,h:170},{x:690,w:50,h:100},{x:750,w:40,h:150}].map((b,i)=>(
          <g key={`b${i}`}>
            <rect x={b.x} y={320-b.h} width={b.w} height={b.h}
              fill={`rgba(94,234,212,${0.04+(i%5)*0.02})`}
              stroke="#5eead4" strokeWidth="0.5" opacity={0.3+(i%4)*0.08} />
            {Array.from({length:Math.floor(b.h/20)},(_,j)=>(
              <rect key={`w${i}${j}`} x={b.x+b.w*0.15} y={320-b.h+j*20+5}
                width={b.w*0.7} height="6" fill="#5eead4"
                opacity={0.15+Math.sin(i*j)*0.1} />
            ))}
          </g>
        ))}
      </g>
      <g opacity="0.25">
        {[[0,380,800,380],[0,400,800,400],[0,420,800,420]].map(([x1,y1,x2,y2],i)=>(
          <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#5eead4" strokeWidth="1"
            strokeDasharray={8+i*4} opacity={0.2+i*0.1} />
        ))}
      </g>
      <text x="400" y="440" textAnchor="middle" fill="#5eead4"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        THE OPERATING SYSTEM FOR A CITY
      </text>
    </g>
  ),
  "pulse-vote": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg3-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" /><stop offset="50%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#0c0a1d" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#bg3-${id})`} />
      <g transform="translate(400,200)" opacity="0.12">
        <path d="M0,-80 C30,-70 50,-50 55,-30 C60,-10 50,10 40,20 C30,30 20,50 10,60 C0,70 -10,65 -20,55 C-30,45 -40,30 -45,15 C-50,0 -45,-15 -40,-30 C-35,-45 -25,-60 -10,-70 C-5,-75 -2,-78 0,-80 Z" fill="#a78bfa" />
      </g>
      <g transform="translate(100,60)" opacity="0.4">
        <rect x="0" y="60" width="20" height="40" fill="#a78bfa" rx="2" opacity="0.5" />
        <rect x="25" y="40" width="20" height="60" fill="#5eead4" rx="2" opacity="0.5" />
        <rect x="50" y="20" width="20" height="80" fill="#a78bfa" rx="2" opacity="0.5" />
        <rect x="75" y="50" width="20" height="50" fill="#5eead4" rx="2" opacity="0.5" />
      </g>
      <g transform="translate(500,60)" opacity="0.35">
        <rect x="0" y="0" width="200" height="120" rx="6" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4" />
        <rect x="10" y="15" width="60" height="8" rx="2" fill="#a78bfa" opacity="0.3" />
        <text x="10" y="50" fill="#a78bfa" fontSize="28" fontFamily="ui-monospace,monospace" fontWeight="bold" opacity="0.5">72%</text>
        <text x="10" y="70" fill="#a78bfa" fontSize="10" fontFamily="ui-monospace,monospace" opacity="0.3">Participation</text>
      </g>
      <g transform="translate(280,250)" opacity="0.5">
        <rect x="0" y="0" width="240" height="160" rx="8" fill="none" stroke="#5eead4" strokeWidth="0.8" opacity="0.3" />
        <text x="20" y="30" fill="#5eead4" fontSize="11" fontFamily="ui-monospace,monospace" opacity="0.5">Cast Your Vote</text>
        {["Option A","Option B","Option C"].map((opt,i)=>(
          <g key={`vo${i}`}>
            <rect x="20" y={45+i*30} width="200" height="22" rx="4"
              fill="none" stroke={i===1?"#5eead4":"#a78bfa"}
              strokeWidth={i===1?"1":"0.5"} opacity={i===1?0.5:0.2} />
            <text x="30" y={59+i*30} fill={i===1?"#5eead4":"#a78bfa"}
              fontSize="10" fontFamily="ui-monospace,monospace" opacity={i===1?0.6:0.3}>{opt}</text>
          </g>
        ))}
      </g>
      <g transform="translate(400,200)" opacity="0.15">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#5eead4" strokeWidth="1" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#a78bfa" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="90" fill="none" stroke="#5eead4" strokeWidth="0.5" opacity="0.5" />
      </g>
      <text x="400" y="440" textAnchor="middle" fill="#a78bfa"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        TRUST &amp; TRANSPARENCY
      </text>
    </g>
  ),
  "graph-visualizer": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg4-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1628" /><stop offset="50%" stopColor="#1a0a2e" /><stop offset="100%" stopColor="#0d1b2a" />
        </linearGradient>
        <filter id={`g4-${id}`}><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="800" height="500" fill={`url(#bg4-${id})`} />
      <g transform="translate(400,220)">
        {[[0,-100,-120,0],[0,-100,120,0],[0,-100,-60,60],[0,-100,60,60],[-120,0,-60,60],[120,0,60,60],[-120,0,-140,80],[120,0,140,80],[-60,60,-140,80],[60,60,140,80],[-140,80,0,130],[140,80,0,130],[-60,60,0,130],[60,60,0,130],[-120,0,-60,-70],[120,0,60,-70]].map(([x1,y1,x2,y2],i)=>(
          <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i%3===0?"#a78bfa":i%3===1?"#5eead4":"#818cf8"}
            strokeWidth="1.2" opacity={0.25+(i%4)*0.08} />
        ))}
        {[{x:0,y:-100,r:10,c:"#5eead4"},{x:-120,y:0,r:8,c:"#a78bfa"},{x:120,y:0,r:8,c:"#818cf8"},{x:-60,y:60,r:7,c:"#5eead4"},{x:60,y:60,r:7,c:"#a78bfa"},{x:-140,y:80,r:5,c:"#818cf8"},{x:140,y:80,r:5,c:"#5eead4"},{x:0,y:130,r:6,c:"#a78bfa"},{x:-60,y:-70,r:5,c:"#818cf8"},{x:60,y:-70,r:5,c:"#5eead4"}].map((n,i)=>(
          <g key={`no${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r+4} fill={n.c} opacity="0.1" filter={`url(#g4-${id})`} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity="0.5" />
            <circle cx={n.x} cy={n.y} r={n.r*0.4} fill={n.c} opacity="0.8" />
          </g>
        ))}
        <circle cx="0" cy="-100" r="16" fill="none" stroke="#5eead4"
          strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
      </g>
      <g transform="translate(50,400)" opacity="0.3">
        <circle cx="10" cy="0" r="4" fill="#5eead4" />
        <text x="20" y="4" fill="#5eead4" fontSize="10" fontFamily="ui-monospace,monospace">Visited</text>
        <circle cx="90" cy="0" r="4" fill="#a78bfa" />
        <text x="100" y="4" fill="#a78bfa" fontSize="10" fontFamily="ui-monospace,monospace">Frontier</text>
        <circle cx="170" cy="0" r="4" fill="#818cf8" />
        <text x="180" y="4" fill="#818cf8" fontSize="10" fontFamily="ui-monospace,monospace">Unexplored</text>
      </g>
      <text x="400" y="460" textAnchor="middle" fill="#5eead4"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        BFS · DFS · SHORTEST PATH
      </text>
    </g>
  ),
  "os-scheduling": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg5-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" /><stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#bg5-${id})`} />
      <g transform="translate(400,150)" opacity="0.2">
        <rect x="-60" y="-60" width="120" height="120" rx="12" fill="none" stroke="#5eead4" strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="ui-monospace,monospace" opacity="0.5">CPU</text>
      </g>
      <g transform="translate(50,260)">
        <line x1="0" y1="0" x2="700" y2="0" stroke="#5eead4" strokeWidth="1" opacity="0.15" />
        {[{x:10,w:80,l:"P1",c:"#5eead4"},{x:95,w:60,l:"P2",c:"#a78bfa"},{x:160,w:100,l:"P3",c:"#818cf8"},{x:265,w:70,l:"P1",c:"#5eead4"},{x:340,w:90,l:"P4",c:"#f472b6"},{x:435,w:55,l:"P2",c:"#a78bfa"},{x:495,w:80,l:"P5",c:"#fb923c"},{x:580,w:65,l:"P3",c:"#818cf8"},{x:650,w:45,l:"P1",c:"#5eead4"}].map((b,i)=>(
          <g key={`g${i}`}>
            <rect x={b.x} y="8" width={b.w} height="28" rx="4"
              fill={b.c} opacity="0.35" stroke={b.c} strokeWidth="0.5" />
            <text x={b.x+b.w/2} y="27" textAnchor="middle" fill={b.c}
              fontSize="10" fontFamily="ui-monospace,monospace" opacity="0.7">{b.l}</text>
          </g>
        ))}
      </g>
      <g transform="translate(50,340)" opacity="0.35">
        <rect x="0" y="0" width="220" height="70" rx="6" fill="none" stroke="#5eead4" strokeWidth="0.5" opacity="0.3" />
        <text x="15" y="20" fill="#5eead4" fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.4">Turnaround: 14.2ms</text>
        <text x="15" y="38" fill="#a78bfa" fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.4">Waiting: 8.7ms</text>
        <text x="15" y="56" fill="#818cf8" fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.4">Throughput: 3.1 proc/ms</text>
      </g>
      <g transform="translate(580,340)" opacity="0.3">
        <rect x="0" y="0" width="170" height="70" rx="6" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.3" />
        <text x="85" y="25" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="ui-monospace,monospace" opacity="0.5">Round Robin</text>
        <text x="85" y="45" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.35">Quantum: 4ms</text>
      </g>
      <text x="400" y="460" textAnchor="middle" fill="#5eead4"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        FCFS · SJF · ROUND ROBIN · PRIORITY
      </text>
    </g>
  ),
  "page-replacement": (id) => (
    <g>
      <defs>
        <linearGradient id={`bg6-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1117" /><stop offset="100%" stopColor="#161b22" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#bg6-${id})`} />
      <g transform="translate(150,60)">
        {Array.from({length:4},(_,row)=>Array.from({length:6},(_,col)=>{
          const idx=row*4+col; const hc=idx<10; const act=idx===3||idx===7;
          return (
            <g key={`m${row}-${col}`}>
              <rect x={col*85} y={row*95} width="75" height="85" rx="6"
                fill={act?"#5eead4":"#1a1a2e"}
                stroke={act?"#5eead4":hc?"#a78bfa":"#1a1a2e"}
                strokeWidth={act?"1.5":"0.8"}
                opacity={act?0.6:hc?0.25:0.05} />
              {hc&&<>
                <text x={col*85+37} y={row*95+45} textAnchor="middle"
                  fill={act?"#5eead4":"#a78bfa"} fontSize="11"
                  fontFamily="ui-monospace,monospace"
                  opacity={act?0.8:0.35}>P{idx+1}</text>
                <text x={col*85+37} y={row*95+62} textAnchor="middle"
                  fill={act?"#5eead4":"#a78bfa"} fontSize="8"
                  fontFamily="ui-monospace,monospace"
                  opacity={act?0.4:0.15}>0x{String(idx*4).padStart(3,"0")}</text>
              </>}
            </g>
          );
        }))}
      </g>
      <g transform="translate(150,440)" opacity="0.3">
        <rect x="0" y="0" width="12" height="12" rx="2" fill="#5eead4" opacity="0.5" />
        <text x="18" y="10" fill="#5eead4" fontSize="10" fontFamily="ui-monospace,monospace" opacity="0.5">Cache Hit</text>
        <rect x="100" y="0" width="12" height="12" rx="2" fill="#f87171" opacity="0.3" />
        <text x="118" y="10" fill="#f87171" fontSize="10" fontFamily="ui-monospace,monospace" opacity="0.4">Page Fault</text>
      </g>
      <g transform="translate(560,80)" opacity="0.35">
        <rect x="0" y="0" width="160" height="80" rx="6" fill="none" stroke="#f87171" strokeWidth="0.5" opacity="0.2" />
        <text x="80" y="25" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="ui-monospace,monospace" opacity="0.4">Page Faults</text>
        <text x="80" y="55" textAnchor="middle" fill="#f87171" fontSize="28" fontFamily="ui-monospace,monospace" fontWeight="bold" opacity="0.5">07</text>
      </g>
      <g transform="translate(560,180)" opacity="0.3">
        {[{l:"FIFO",v:"12",c:"#5eead4"},{l:"LRU",v:"09",c:"#a78bfa"},{l:"OPT",v:"06",c:"#818cf8"}].map((a,i)=>(
          <g key={`al${i}`}>
            <rect x="0" y={i*30} width="160" height="25" rx="4" fill="none" stroke={a.c} strokeWidth="0.5" opacity="0.2" />
            <text x="15" y={i*30+17} fill={a.c} fontSize="11" fontFamily="ui-monospace,monospace" opacity="0.5">{a.l}</text>
            <text x="140" y={i*30+17} textAnchor="end" fill={a.c} fontSize="11" fontFamily="ui-monospace,monospace" fontWeight="bold" opacity="0.6">{a.v}</text>
          </g>
        ))}
      </g>
      <text x="400" y="470" textAnchor="middle" fill="#5eead4"
        fontSize="14" fontFamily="ui-monospace,monospace"
        letterSpacing="3" opacity="0.7">
        FIFO · LRU · OPTIMAL
      </text>
    </g>
  ),

};

export default ProjectCover;
